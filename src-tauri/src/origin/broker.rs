use super::{
    document::{self, MAX_SOURCE},
    protocol::{self, sha256},
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    collections::{BTreeMap, HashMap},
    fs,
    io::{Read, Write},
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::{
        atomic::{AtomicBool, AtomicU64, Ordering},
        Arc, Mutex, Weak,
    },
    time::{Duration, Instant},
};

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OriginDocumentRef {
    pub session_id: String,
    pub model: Value,
    pub view: Option<Value>,
}
pub struct Session {
    pub model: Value,
    pub resources: BTreeMap<String, PathBuf>,
    pub _directory: tempfile::TempDir,
}
// Windows denies concurrent writers/deletion for the lifetime of this read.
// Other platforms also check size/mtime before accepting the byte snapshot.
fn read_source(path: &Path) -> Result<Vec<u8>, String> {
    let mut options = fs::OpenOptions::new();
    options.read(true);
    #[cfg(windows)]
    {
        use std::os::windows::fs::OpenOptionsExt;
        options.share_mode(1);
    }
    let mut file = options.open(path).map_err(crate::storage::file_error)?;
    let before = file.metadata().map_err(crate::storage::file_error)?;
    if !before.is_file() || before.len() > MAX_SOURCE as u64 {
        return Err("ORIGIN_TOO_LARGE".into());
    }
    let mut bytes = Vec::new();
    bytes
        .try_reserve_exact(before.len() as usize)
        .map_err(|_| "ORIGIN_MEMORY")?;
    (&mut file)
        .take(MAX_SOURCE as u64 + 1)
        .read_to_end(&mut bytes)
        .map_err(crate::storage::file_error)?;
    let after = file.metadata().map_err(crate::storage::file_error)?;
    if bytes.len() as u64 != before.len()
        || before.len() != after.len()
        || before.modified().ok() != after.modified().ok()
    {
        return Err("ORIGIN_SOURCE_CHANGED".into());
    }
    Ok(bytes)
}
#[derive(Default)]
pub struct OriginStore {
    sessions: Mutex<HashMap<String, Arc<Session>>>,
    cache: Mutex<HashMap<String, Weak<Session>>>,
    running: Mutex<HashMap<String, Arc<AtomicBool>>>,
    sequence: AtomicU64,
}
impl OriginStore {
    pub fn get(&self, id: &str) -> Result<Arc<Session>, String> {
        self.sessions
            .lock()
            .map_err(|_| "ORIGIN_LOCK")?
            .get(id)
            .cloned()
            .ok_or("ORIGIN_SESSION_EXPIRED".into())
    }
    pub fn retain(&self, session: Session) -> Result<OriginDocumentRef, String> {
        self.retain_shared(Arc::new(session))
    }
    fn retain_shared(&self, session: Arc<Session>) -> Result<OriginDocumentRef, String> {
        let mut sessions = self.sessions.lock().map_err(|_| "ORIGIN_LOCK")?;
        if sessions.len() >= 16 {
            return Err("ORIGIN_SESSION_LIMIT".into());
        }
        let id = format!(
            "origin-{}",
            self.sequence.fetch_add(1, Ordering::Relaxed) + 1
        );
        let model = session.model.clone();
        sessions.insert(id.clone(), session);
        Ok(OriginDocumentRef {
            session_id: id,
            model,
            view: None,
        })
    }
    pub fn release(&self, id: &str) -> Result<(), String> {
        self.sessions.lock().map_err(|_| "ORIGIN_LOCK")?.remove(id);
        Ok(())
    }
    pub fn cancel(&self, id: &str) -> Result<(), String> {
        if let Some(flag) = self.running.lock().map_err(|_| "ORIGIN_LOCK")?.get(id) {
            flag.store(true, Ordering::Relaxed)
        }
        Ok(())
    }
    pub fn open(&self, path: &Path, request_id: &str) -> Result<OriginDocumentRef, String> {
        self.open_mode(path, request_id, false)
    }
    pub fn open_archive(&self, path: &Path, request_id: &str) -> Result<OriginDocumentRef, String> {
        self.open_mode(path, request_id, true)
    }
    fn open_mode(
        &self,
        path: &Path,
        request_id: &str,
        archive_only: bool,
    ) -> Result<OriginDocumentRef, String> {
        if request_id.len() > 100 || request_id.is_empty() {
            return Err("ORIGIN_REQUEST_ID".into());
        }
        let cancel = Arc::new(AtomicBool::new(false));
        {
            let mut running = self.running.lock().map_err(|_| "ORIGIN_LOCK")?;
            if running.len() >= 2 || running.contains_key(request_id) {
                return Err("ORIGIN_BUSY".into());
            }
            running.insert(request_id.into(), cancel.clone());
        }
        let result = (|| {
            let bytes = read_source(path)?;
            if cancel.load(Ordering::Relaxed) {
                return Err("ORIGIN_CANCELLED".into());
            }
            if archive_only {
                let name = path.file_name().unwrap_or_default().to_string_lossy();
                let mut model = document::archive_only(&name, &bytes);
                model["nodes"][0]["capabilities"]["unsupportedReason"] = json!("USER_ARCHIVE_ONLY");
                return self.retain(session_from_bytes(
                    model,
                    BTreeMap::from([("original".into(), bytes)]),
                )?);
            }
            if bytes.starts_with(b"PK\x03\x04") {
                let (session, view) = super::archive::decode(&bytes)?;
                let mut document = self.retain(session)?;
                document.view = Some(view);
                return Ok(document);
            }
            let detected = document::detect(&bytes)?;
            let name = path.file_name().unwrap_or_default().to_string_lossy();
            let source_hash = sha256(&bytes);
            let cache_key = format!("{source_hash}:b636dba-apio3:oim1");
            let cached = {
                let mut cache = self.cache.lock().map_err(|_| "ORIGIN_LOCK")?;
                cache.retain(|_, v| v.strong_count() > 0);
                cache.get(&cache_key).and_then(Weak::upgrade)
            };
            if let Some(session) = cached {
                if session.model["source"]["name"] == name.as_ref() {
                    return self.retain_shared(session);
                }
            }
            let mut resources = BTreeMap::new();
            let mut model = if detected["canDecode"] == true {
                #[cfg(windows)]
                {
                    let stage = tempfile::Builder::new()
                        .prefix("apio-origin-input-")
                        .tempdir()
                        .map_err(crate::storage::file_error)?;
                    let source = stage.path().join("input.opj");
                    fs::write(&source, &bytes).map_err(crate::storage::file_error)?;
                    let mut decoded = decode_sandbox(&source, &cancel)?;
                    decoded.metadata["format"] = json!("APIO_ORIGIN_DOCUMENT");
                    decoded.metadata["schemaVersion"] = json!(1);
                    decoded.metadata["source"] = json!({"name":name,"size":bytes.len(),"sha256":source_hash,"detected":detected});
                    decoded.metadata["decoder"] =
                        json!({"name":"liborigin","version":"3.0.3","revision":"b636dba-apio3"});
                    decoded.metadata["sourceResourceId"] = json!("original");
                    decoded.metadata["resources"].as_array_mut().ok_or("ORIGIN_INVALID_PROTOCOL")?.push(json!({"id":"original","kind":"original","size":bytes.len(),"sha256":source_hash}));
                    for n in decoded.metadata["nodes"]
                        .as_array_mut()
                        .ok_or("ORIGIN_INVALID_MODEL")?
                    {
                        n["capabilities"]["archived"] = json!(true)
                    }
                    document::validate_model(&decoded.metadata)?;
                    if cancel.load(Ordering::Relaxed) {
                        return Err("ORIGIN_CANCELLED".into());
                    }
                    let original = decoded.directory.path().join("original.bin");
                    fs::write(&original, &bytes).map_err(crate::storage::file_error)?;
                    decoded.resources.insert("original".into(), original);
                    let session = Arc::new(Session {
                        model: decoded.metadata,
                        resources: decoded.resources,
                        _directory: decoded.directory,
                    });
                    self.cache
                        .lock()
                        .map_err(|_| "ORIGIN_LOCK")?
                        .insert(cache_key, Arc::downgrade(&session));
                    return self.retain_shared(session);
                }

                #[cfg(not(windows))]
                {
                    let mut m = document::archive_only(&name, &bytes);
                    m["diagnostics"].as_array_mut().unwrap().push(json!({"code":"SANDBOX_UNAVAILABLE_ON_OS","severity":"warning","nodeId":null,"offset":null}));
                    m
                }
            } else {
                document::archive_only(&name, &bytes)
            };
            resources.insert("original".into(), bytes);
            for n in model["nodes"]
                .as_array_mut()
                .ok_or("ORIGIN_INVALID_MODEL")?
            {
                n["capabilities"]["archived"] = json!(true)
            }
            if cancel.load(Ordering::Relaxed) {
                return Err("ORIGIN_CANCELLED".into());
            }
            let session = Arc::new(session_from_bytes(model, resources)?);
            self.cache
                .lock()
                .map_err(|_| "ORIGIN_LOCK")?
                .insert(cache_key, Arc::downgrade(&session));
            self.retain_shared(session)
        })();
        self.running
            .lock()
            .map_err(|_| "ORIGIN_LOCK")?
            .remove(request_id);
        result
    }
}
pub(super) fn session_from_bytes(
    model: Value,
    resources: BTreeMap<String, Vec<u8>>,
) -> Result<Session, String> {
    document::validate_model(&model)?;
    let entries = model["resources"]
        .as_array()
        .ok_or("ORIGIN_INVALID_MODEL")?;
    if entries.len() != resources.len() {
        return Err("ORIGIN_INVALID_RESOURCE".into());
    }
    let directory = tempfile::Builder::new()
        .prefix("apio-origin-session-")
        .tempdir()
        .map_err(crate::storage::file_error)?;
    let mut paths = BTreeMap::new();
    for (i, entry) in entries.iter().enumerate() {
        let id = entry["id"].as_str().ok_or("ORIGIN_INVALID_RESOURCE")?;
        let bytes = resources.get(id).ok_or("ORIGIN_INVALID_RESOURCE")?;
        if entry["size"].as_u64() != Some(bytes.len() as u64) || entry["sha256"] != sha256(bytes) {
            return Err("ORIGIN_RESOURCE_HASH".into());
        }
        let path = directory.path().join(format!("{i}.bin"));
        let mut file = fs::File::create(&path).map_err(crate::storage::file_error)?;
        file.write_all(bytes).map_err(crate::storage::file_error)?;
        paths.insert(id.into(), path);
    }
    Ok(Session {
        model,
        resources: paths,
        _directory: directory,
    })
}
#[cfg(windows)]
fn decode_sandbox(path: &Path, cancel: &AtomicBool) -> Result<protocol::DiskDecoded, String> {
    use std::os::windows::process::CommandExt;
    static HELPER: &[u8] = include_bytes!(env!("APIO_ORIGIN_HELPER_PATH"));
    let binary = path.parent().ok_or("ORIGIN_STAGING")?.join("broker.exe");
    fs::write(&binary, HELPER).map_err(crate::storage::file_error)?;
    let mut child = Command::new(binary)
        .arg("--sandbox")
        .arg(path)
        .creation_flags(0x08000000)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| format!("ORIGIN_SANDBOX_START:{e}"))?;
    let stdout = child.stdout.take().ok_or("ORIGIN_SANDBOX_PIPE")?;
    let reader = std::thread::spawn(move || protocol::read_protocol_on_disk(stdout));
    let start = Instant::now();
    let mut failed = None;
    let mut cancellation = None;
    let status = loop {
        if cancel.load(Ordering::Relaxed) || start.elapsed() > Duration::from_secs(35) {
            if cancellation.is_none() {
                failed = Some(if cancel.load(Ordering::Relaxed) {
                    "ORIGIN_CANCELLED"
                } else {
                    "ORIGIN_TIMEOUT"
                });
                if let Some(input) = child.stdin.as_mut() {
                    let _ = input.write_all(b"C");
                }
                cancellation = Some(Instant::now());
            }
            if cancellation.is_some_and(|at| at.elapsed() > Duration::from_secs(2)) {
                let _ = child.kill();
                break child.wait();
            }
        }
        match child.try_wait() {
            Ok(Some(status)) => break Ok(status),
            Ok(None) => std::thread::sleep(Duration::from_millis(5)),
            Err(e) => {
                let _ = child.kill();
                break Err(e);
            }
        }
    };
    let decoded = reader.join().map_err(|_| "ORIGIN_SANDBOX_CRASH")?;
    if let Some(error) = failed {
        return Err(error.into());
    }
    if !status.map_err(crate::storage::file_error)?.success() {
        return Err("ORIGIN_SANDBOX_DECODE_FAILED".into());
    }
    decoded
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn source_snapshot_preserves_bytes_and_rejects_non_files() {
        let directory = tempfile::tempdir().unwrap();
        let file = directory.path().join("own.opj");
        fs::write(&file, b"exact\0\xff").unwrap();
        assert_eq!(read_source(&file).unwrap(), b"exact\0\xff");
        assert!(read_source(directory.path()).is_err());
    }
    #[test]
    fn explicit_archive_preserves_a_truncated_source_without_decoding() {
        let directory = tempfile::tempdir().unwrap();
        let path = directory.path().join("own.opj");
        fs::write(&path, b"CPYA 4,3168\n").unwrap();
        let store = OriginStore::default();
        assert!(store.open(&path, "decode").is_err());
        let doc = store.open_archive(&path, "archive").unwrap();
        assert_eq!(doc.model["decoder"]["name"], "archive-only");
        assert!(doc.model["columns"].as_array().unwrap().is_empty());
        assert_eq!(
            fs::read(&store.get(&doc.session_id).unwrap().resources["original"]).unwrap(),
            b"CPYA 4,3168\n"
        );
    }
    #[test]
    #[ignore = "local generated stress fixture; APIO_ORIGIN_BENCH_DIR required"]
    fn external_pipeline_measurements() {
        let directory = PathBuf::from(
            std::env::var_os("APIO_ORIGIN_BENCH_DIR").expect("APIO_ORIGIN_BENCH_DIR"),
        );
        for count in [10_000, 100_000, 1_000_000] {
            let mut measurements = vec![];
            for iteration in 0..3 {
                let store = OriginStore::default();
                let path = directory.join(format!("payload-{count}.opj"));
                let at = Instant::now();
                let doc = store.open(&path, "measure").unwrap();
                let open_ms = at.elapsed().as_secs_f64() * 1000.;
                let session = store.get(&doc.session_id).unwrap();
                assert!(session.model["columns"]
                    .as_array()
                    .unwrap()
                    .iter()
                    .any(|c| c["rowCount"] == count));
                let at = Instant::now();
                let cached = store.open(&path, "cached").unwrap();
                let cache_ms = at.elapsed().as_secs_f64() * 1000.;
                assert!(Arc::ptr_eq(
                    &session,
                    &store.get(&cached.session_id).unwrap()
                ));
                let view = json!({"encoding":"windows-1251","selectedId":null,"includedIds":[],"includeSource":true});
                let at = Instant::now();
                let archive = super::super::archive::encode(&session, &view).unwrap();
                let save_ms = at.elapsed().as_secs_f64() * 1000.;
                let at = Instant::now();
                let (restored, _) = super::super::archive::decode(&archive).unwrap();
                let reopen_ms = at.elapsed().as_secs_f64() * 1000.;
                assert_eq!(restored.model, session.model);
                measurements.push(json!({"iteration":iteration,"openMs":open_ms,"cacheMs":cache_ms,"saveMs":save_ms,"reopenMs":reopen_ms,"archiveBytes":archive.len()}));
            }
            println!(
                "APIO_BENCH {}",
                json!({"rows":count,"measurements":measurements})
            );
        }
    }
    #[test]
    #[ignore = "local stress fixture; APIO_ORIGIN_BENCH_DIR required"]
    fn external_cancel_commits_no_session() {
        let path = PathBuf::from(
            std::env::var_os("APIO_ORIGIN_BENCH_DIR").expect("APIO_ORIGIN_BENCH_DIR"),
        )
        .join("payload-1000000.opj");
        let store = Arc::new(OriginStore::default());
        let worker_store = store.clone();
        let worker = std::thread::spawn(move || worker_store.open(&path, "cancel-test"));
        let deadline = Instant::now();
        while !store.running.lock().unwrap().contains_key("cancel-test") {
            assert!(deadline.elapsed() < Duration::from_secs(5));
            std::thread::yield_now();
        }
        std::thread::sleep(Duration::from_millis(30));
        let cancelled_at = Instant::now();
        store.cancel("cancel-test").unwrap();
        assert!(matches!(worker.join().unwrap(),Err(e) if e=="ORIGIN_CANCELLED"));
        assert!(store.sessions.lock().unwrap().is_empty());
        assert!(store.running.lock().unwrap().is_empty());
        assert!(cancelled_at.elapsed() < Duration::from_secs(3));
        println!(
            "APIO_CANCEL_MS {}",
            cancelled_at.elapsed().as_secs_f64() * 1000.
        );
    }
    #[test]
    fn detects_resource_substitution_before_retaining_a_session() {
        let bytes = b"own synthetic".to_vec();
        let model = document::archive_only("own.opju", &bytes);
        let resources = BTreeMap::from([("original".into(), b"changed bytes".to_vec())]);
        assert!(session_from_bytes(model, resources).is_err());
    }
    #[test]
    fn expired_session_does_not_grant_a_file_path() {
        let store = OriginStore::default();
        assert!(store.get("C:/anything").is_err());
    }
    #[test]
    fn identical_source_reuses_immutable_resources_without_redecoding() {
        let directory = tempfile::tempdir().unwrap();
        let path = directory.path().join("own.opju");
        fs::write(&path, b"own unknown source").unwrap();
        let store = OriginStore::default();
        let first = store.open(&path, "first").unwrap();
        let second = store.open(&path, "second").unwrap();
        assert_ne!(first.session_id, second.session_id);
        assert!(Arc::ptr_eq(
            &store.get(&first.session_id).unwrap(),
            &store.get(&second.session_id).unwrap()
        ));
        store.release(&first.session_id).unwrap();
        assert_eq!(
            store.get(&second.session_id).unwrap().model["source"]["name"],
            "own.opju"
        );
    }
    #[test]
    #[ignore = "external confidential fixture; APIO_ORIGIN_FIXTURE must be supplied locally"]
    fn external_fixture_isolated_round_trip() {
        let path = std::env::var_os("APIO_ORIGIN_FIXTURE").expect("APIO_ORIGIN_FIXTURE");
        let store = OriginStore::default();
        let document = store.open(Path::new(&path), "external-test").unwrap();
        assert_eq!(document.model["columns"].as_array().unwrap().len(), 38);
        assert_eq!(
            document.model["columns"]
                .as_array()
                .unwrap()
                .iter()
                .filter(|c| c["role"] == "X")
                .count(),
            7
        );
        assert_eq!(
            document.model["nodes"]
                .as_array()
                .unwrap()
                .iter()
                .filter(|n| n["properties"]["commandHex"]
                    .as_str()
                    .is_some_and(|s| !s.is_empty()))
                .count(),
            6
        );
        assert_eq!(
            document.model["nodes"]
                .as_array()
                .unwrap()
                .iter()
                .filter(|n| n["kind"] == "attachment")
                .count(),
            8
        );
        let session = store.get(&document.session_id).unwrap();
        let view = json!({"encoding":"windows-1251","selectedId":null,"includedIds":[],"includeSource":true});
        let bytes = super::super::archive::encode(&session, &view).unwrap();
        let (restored, _) = super::super::archive::decode(&bytes).unwrap();
        assert_eq!(restored.model, session.model);
        let output = tempfile::tempdir().unwrap();
        let saved_path = output.path().join("saved-origin.aph");
        crate::storage::atomic_write(&saved_path, &bytes).unwrap();
        store.release(&document.session_id).unwrap();
        let reopened_store = OriginStore::default();
        let reopened = reopened_store.open(&saved_path, "reopen-external").unwrap();
        assert_eq!(reopened.model, session.model);
        assert_eq!(
            fs::read(&restored.resources["original"]).unwrap(),
            fs::read(path).unwrap()
        );
    }
}
