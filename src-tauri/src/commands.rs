use crate::storage::{self, Recovery, MAX_FILE_BYTES};
use std::{
    borrow::Cow,
    collections::{HashSet, VecDeque},
    path::{Path, PathBuf},
    sync::{
        atomic::{AtomicU64, Ordering},
        Mutex,
    },
};
use tauri::ipc::{InvokeBody, Request, Response};
use tauri::{AppHandle, Manager, State, WebviewWindow};
use tauri_plugin_dialog::DialogExt;

fn raw_bytes(body: &InvokeBody) -> Result<Cow<'_, [u8]>, String> {
    raw_bytes_limit(body, MAX_FILE_BYTES)
}
fn raw_bytes_limit(body: &InvokeBody, limit: u64) -> Result<Cow<'_, [u8]>, String> {
    let bytes = match body {
        InvokeBody::Raw(bytes) => Cow::Borrowed(bytes.as_slice()),
        // Tauri falls back to JSON postMessage when custom-protocol IPC is unavailable.
        InvokeBody::Json(value) => {
            let values = value.as_array().ok_or("FILE_BINARY_REQUIRED")?;
            if values.len() as u64 > limit {
                return Err("FILE_TOO_LARGE".into());
            }
            let bytes: Result<Vec<u8>, _> = values
                .iter()
                .map(|v| {
                    v.as_u64()
                        .and_then(|v| u8::try_from(v).ok())
                        .ok_or("FILE_BINARY_REQUIRED")
                })
                .collect();
            Cow::Owned(bytes?)
        }
    };
    if bytes.len() as u64 > limit {
        return Err("FILE_TOO_LARGE".into());
    }
    Ok(bytes)
}
fn project_text(body: Cow<'_, [u8]>) -> Result<Cow<'_, str>, String> {
    match body {
        Cow::Borrowed(bytes) => std::str::from_utf8(bytes)
            .map(Cow::Borrowed)
            .map_err(|e| format!("PROJECT_INVALID_UTF8:{e}")),
        Cow::Owned(bytes) => String::from_utf8(bytes)
            .map(Cow::Owned)
            .map_err(|e| format!("PROJECT_INVALID_UTF8:{e}")),
    }
}
fn request_path(request: &Request<'_>) -> Result<Option<String>, String> {
    let Some(value) = request.headers().get("x-apio-path") else {
        return Ok(None);
    };
    let value = value
        .to_str()
        .map_err(|_| "FILE_INVALID_PATH".to_string())?;
    if value.is_empty() {
        return Ok(None);
    }
    percent_encoding::percent_decode_str(value)
        .decode_utf8()
        .map(|v| Some(v.into_owned()))
        .map_err(|_| "FILE_INVALID_PATH".to_string())
}
fn image_extension(value: Option<&str>) -> Result<String, String> {
    let extension = value
        .unwrap_or_default()
        .trim_start_matches('.')
        .to_ascii_lowercase();
    if !["svg", "png", "jpg", "jpeg", "tif", "tiff"].contains(&extension.as_str()) {
        return Err("EXPORT_UNSUPPORTED_FORMAT".into());
    }
    Ok(extension)
}

#[derive(Default)]
pub struct FileAccess {
    projects: Mutex<HashSet<PathBuf>>,
    pub pending: Mutex<VecDeque<PathBuf>>,
    pub dropped: Mutex<HashSet<PathBuf>>,
    upload: Mutex<Option<BinaryUpload>>,
    upload_sequence: AtomicU64,
}
const NATIVE_BLOCK_BYTES: usize = 256 * 1024;
struct BinaryUpload {
    id: u64,
    expected: usize,
    bytes: Vec<u8>,
}

impl FileAccess {
    fn begin_upload(&self, length: usize) -> Result<u64, String> {
        if length as u64 > MAX_FILE_BYTES {
            return Err("FILE_TOO_LARGE".into());
        }
        let mut upload = self.upload.lock().map_err(storage::file_error)?;
        // A reload can abandon a transfer; a new token releases that incomplete data.
        *upload = None;
        let mut bytes = Vec::new();
        bytes
            .try_reserve_exact(length)
            .map_err(|_| "FILE_MEMORY".to_string())?;
        let id = self.upload_sequence.fetch_add(1, Ordering::Relaxed) + 1;
        *upload = Some(BinaryUpload {
            id,
            expected: length,
            bytes,
        });
        Ok(id)
    }
    fn append_upload(&self, id: u64, offset: usize, bytes: &[u8]) -> Result<usize, String> {
        if bytes.len() > NATIVE_BLOCK_BYTES {
            return Err("FILE_TOO_LARGE".into());
        }
        let mut upload = self.upload.lock().map_err(storage::file_error)?;
        let active = upload
            .as_mut()
            .filter(|u| u.id == id)
            .ok_or("FILE_INVALID_TRANSFER")?;
        if offset != active.bytes.len() || bytes.len() > active.expected - active.bytes.len() {
            return Err("FILE_INCOMPLETE_TRANSFER".into());
        }
        active.bytes.extend_from_slice(bytes);
        Ok(active.bytes.len())
    }
    fn take_upload(&self, id: u64) -> Result<Vec<u8>, String> {
        let mut upload = self.upload.lock().map_err(storage::file_error)?;
        let active = upload
            .as_ref()
            .filter(|u| u.id == id)
            .ok_or("FILE_INVALID_TRANSFER")?;
        if active.bytes.len() != active.expected {
            return Err("FILE_INCOMPLETE_TRANSFER".into());
        }
        Ok(upload.take().unwrap().bytes)
    }
    fn abort_upload(&self, id: u64) -> Result<(), String> {
        let mut upload = self.upload.lock().map_err(storage::file_error)?;
        if upload.as_ref().is_some_and(|u| u.id == id) {
            *upload = None
        }
        Ok(())
    }
    fn grant(&self, path: &Path) -> Result<(), String> {
        if storage::project_path(path) {
            self.projects.lock().map_err(storage::file_error)?.insert(
                storage::canonical_destination(path).unwrap_or_else(|_| path.to_path_buf()),
            );
        }
        Ok(())
    }

    fn granted(&self, path: &Path) -> Result<PathBuf, String> {
        let canonical = storage::canonical_destination(path).map_err(storage::file_error)?;
        if !storage::project_path(&canonical)
            || !self
                .projects
                .lock()
                .map_err(storage::file_error)?
                .contains(&canonical)
        {
            return Err("FILE_NOT_GRANTED".into());
        }
        Ok(canonical)
    }

    fn known_project(&self, path: &Path) -> Result<bool, String> {
        let projects = self.projects.lock().map_err(storage::file_error)?;
        Ok(storage::project_path(path)
            && (projects.contains(path)
                || storage::canonical_destination(path).is_ok_and(|path| projects.contains(&path))))
    }

    fn consume_drop(&self, path: &Path) -> Result<(), String> {
        let allowed = self
            .dropped
            .lock()
            .map_err(|_| "NATIVE_STATE_ERROR".to_string())?
            .remove(path);
        if allowed {
            Ok(())
        } else {
            Err("FILE_NOT_GRANTED".into())
        }
    }
}

fn request_number(request: &Request<'_>, name: &str) -> Result<u64, String> {
    request
        .headers()
        .get(name)
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.parse().ok())
        .ok_or("FILE_INVALID_TRANSFER".into())
}
fn request_bytes<'a>(
    request: &'a Request<'_>,
    access: &FileAccess,
) -> Result<Cow<'a, [u8]>, String> {
    if request.headers().contains_key("x-apio-transfer") {
        raw_bytes_limit(request.body(), 0)?;
        return access
            .take_upload(request_number(request, "x-apio-transfer")?)
            .map(Cow::Owned);
    }
    raw_bytes(request.body())
}
#[tauri::command]
pub async fn begin_binary_transfer(
    window: WebviewWindow,
    access: State<'_, FileAccess>,
    length: usize,
) -> Result<u64, String> {
    main_window(&window)?;
    access.begin_upload(length)
}
#[tauri::command]
pub async fn append_binary_transfer(
    window: WebviewWindow,
    access: State<'_, FileAccess>,
    request: Request<'_>,
) -> Result<usize, String> {
    main_window(&window)?;
    let bytes = raw_bytes_limit(request.body(), NATIVE_BLOCK_BYTES as u64)?;
    access.append_upload(
        request_number(&request, "x-apio-transfer")?,
        usize::try_from(request_number(&request, "x-apio-offset")?)
            .map_err(|_| "FILE_INVALID_TRANSFER")?,
        &bytes,
    )
}
#[tauri::command]
pub async fn abort_binary_transfer(
    window: WebviewWindow,
    access: State<'_, FileAccess>,
    id: u64,
) -> Result<(), String> {
    main_window(&window)?;
    access.abort_upload(id)
}

pub struct OpenedFile {
    name: String,
    path: String,
    bytes: Vec<u8>,
}

/// Metadata is one UTF-8 JSON line; the remaining bytes are the exact file body.
fn opened_response(file: Option<OpenedFile>) -> Result<Response, String> {
    let Some(file) = file else {
        return Ok(Response::new(Vec::<u8>::new()));
    };
    let mut bytes = serde_json::to_vec(&serde_json::json!({"name":file.name,"path":file.path}))
        .map_err(storage::file_error)?;
    bytes.push(b'\n');
    bytes.extend_from_slice(&file.bytes);
    Ok(Response::new(bytes))
}

fn main_window(window: &WebviewWindow) -> Result<(), String> {
    if window.label() == "main" {
        Ok(())
    } else {
        Err("WINDOW_NOT_ALLOWED".into())
    }
}

fn read_selected(path: &Path, access: &FileAccess) -> Result<OpenedFile, String> {
    let path = path.canonicalize().map_err(storage::file_error)?;
    let bytes = storage::bounded_read(&path, MAX_FILE_BYTES).map_err(storage::file_error)?;
    access.grant(&path)?;
    Ok(OpenedFile {
        name: path
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string(),
        path: path.to_string_lossy().to_string(),
        bytes,
    })
}

#[tauri::command]
pub async fn open_file(
    app: AppHandle,
    window: WebviewWindow,
    access: State<'_, FileAccess>,
    kind: Option<String>,
) -> Result<Response, String> {
    main_window(&window)?;
    let extensions: &[&str] = match kind.as_deref() {
        Some("project") => &["aph"],
        Some("data") => &["txt", "csv", "tsv"],
        _ => &["aph", "txt", "csv", "tsv"],
    };
    let selected = app
        .dialog()
        .file()
        .set_parent(&window)
        .add_filter("APIO GRAPH / Data", extensions)
        .blocking_pick_file();
    let file = selected
        .map(|file| {
            let path = file.into_path().map_err(storage::file_error)?;
            read_selected(&path, &access)
        })
        .transpose()?;
    opened_response(file)
}

#[tauri::command]
pub async fn initial_file(
    window: WebviewWindow,
    access: State<'_, FileAccess>,
) -> Result<Response, String> {
    main_window(&window)?;
    let path = access
        .pending
        .lock()
        .map_err(storage::file_error)?
        .pop_front();
    opened_response(path.map(|path| read_selected(&path, &access)).transpose()?)
}

#[tauri::command]
pub async fn read_dropped_file(
    window: WebviewWindow,
    access: State<'_, FileAccess>,
    path: String,
) -> Result<Response, String> {
    main_window(&window)?;
    let path = PathBuf::from(path);
    access.consume_drop(&path)?;
    opened_response(Some(read_selected(&path, &access)?))
}

#[tauri::command]
pub async fn save_project(
    app: AppHandle,
    window: WebviewWindow,
    access: State<'_, FileAccess>,
    request: Request<'_>,
) -> Result<Option<String>, String> {
    main_window(&window)?;
    let text = project_text(request_bytes(&request, &access)?)?;
    storage::validate_project_text(&text)?;
    let path = request_path(&request)?;
    let save_as = match request
        .headers()
        .get("x-apio-save-as")
        .and_then(|v| v.to_str().ok())
    {
        Some("1") => true,
        Some("0") | None => false,
        _ => return Err("FILE_INVALID_SAVE_MODE".into()),
    };
    let granted_path = path
        .as_deref()
        .and_then(|path| access.granted(Path::new(path)).ok())
        .filter(|_| !save_as);
    let destination = if let Some(destination) = granted_path {
        destination
    } else {
        let mut dialog = app
            .dialog()
            .file()
            .set_parent(&window)
            .add_filter("APIO GRAPH project", &["aph"]);
        let suggested = path
            .as_deref()
            .and_then(|p| Path::new(p).file_name())
            .and_then(|p| p.to_str())
            .unwrap_or("project.aph");
        dialog = dialog.set_file_name(suggested);
        let Some(selected) = dialog.blocking_save_file() else {
            return Ok(None);
        };
        let path = selected.into_path().map_err(storage::file_error)?;
        if !storage::project_path(&path) {
            return Err("PROJECT_EXTENSION_REQUIRED".into());
        }
        storage::canonical_destination(&path).map_err(storage::file_error)?
    };
    storage::atomic_write(&destination, text.as_bytes()).map_err(storage::file_error)?;
    access.grant(&destination)?;
    Ok(Some(destination.to_string_lossy().to_string()))
}

#[tauri::command]
pub async fn save_image(
    app: AppHandle,
    window: WebviewWindow,
    access: State<'_, FileAccess>,
    request: Request<'_>,
) -> Result<Option<String>, String> {
    main_window(&window)?;
    let extension = image_extension(
        request
            .headers()
            .get("x-apio-extension")
            .and_then(|v| v.to_str().ok()),
    )?;
    let bytes = request_bytes(&request, &access)?;
    let selected = app
        .dialog()
        .file()
        .set_parent(&window)
        .add_filter("Chart image", &[extension.as_str()])
        .set_file_name(format!("chart.{extension}"))
        .blocking_save_file();
    let Some(selected) = selected else {
        return Ok(None);
    };
    let path = selected.into_path().map_err(storage::file_error)?;
    if path
        .extension()
        .is_none_or(|ext| !ext.eq_ignore_ascii_case(&extension))
    {
        return Err(format!("EXPORT_EXTENSION_REQUIRED:{extension}"));
    }
    storage::atomic_write(&path, &bytes).map_err(storage::file_error)?;
    Ok(Some(path.to_string_lossy().to_string()))
}

#[tauri::command]
pub async fn write_recovery(
    app: AppHandle,
    window: WebviewWindow,
    access: State<'_, FileAccess>,
    request: Request<'_>,
) -> Result<(), String> {
    main_window(&window)?;
    let text = project_text(request_bytes(&request, &access)?)?.into_owned();
    let path = request_path(&request)?;
    if let Some(path) = &path {
        if !access.known_project(Path::new(path))? {
            return Err("RECOVERY_PATH_NOT_GRANTED".into());
        }
    }
    let directory = app.path().app_data_dir().map_err(storage::file_error)?;
    storage::write_recovery_at(&directory, &Recovery { text, path })
}

#[tauri::command]
pub async fn read_recovery(
    app: AppHandle,
    window: WebviewWindow,
    access: State<'_, FileAccess>,
) -> Result<Option<Recovery>, String> {
    main_window(&window)?;
    let directory = app.path().app_data_dir().map_err(storage::file_error)?;
    let recovery = storage::read_recovery_at(&directory)?;
    if let Some(Recovery {
        path: Some(path), ..
    }) = &recovery
    {
        // Remember the original even when its directory was removed. Recovery can
        // still continue, and saving to an unavailable directory opens Save As.
        access.grant(Path::new(path))?;
    }
    Ok(recovery)
}

#[tauri::command]
pub async fn clear_recovery(app: AppHandle, window: WebviewWindow) -> Result<(), String> {
    main_window(&window)?;
    let directory = app.path().app_data_dir().map_err(storage::file_error)?;
    match std::fs::remove_file(storage::recovery_file(&directory)) {
        Ok(()) => Ok(()),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(e) => Err(storage::file_error(e)),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn bounded_upload_roundtrip_preserves_every_byte() {
        let access = FileAccess::default();
        let source: Vec<u8> = (0..NATIVE_BLOCK_BYTES * 3 + 17).map(|i| i as u8).collect();
        let id = access.begin_upload(source.len()).unwrap();
        let mut offset = 0;
        for part in source.chunks(NATIVE_BLOCK_BYTES) {
            assert_eq!(
                access.append_upload(id, offset, part),
                Ok(offset + part.len())
            );
            offset += part.len();
        }
        assert_eq!(access.take_upload(id).unwrap(), source);
        assert_eq!(access.take_upload(id), Err("FILE_INVALID_TRANSFER".into()));
    }
    #[test]
    fn upload_rejects_partial_replayed_oversized_and_out_of_order_blocks() {
        let access = FileAccess::default();
        assert_eq!(
            access.begin_upload(MAX_FILE_BYTES as usize + 1),
            Err("FILE_TOO_LARGE".into())
        );
        let id = access.begin_upload(3).unwrap();
        assert_eq!(
            access.take_upload(id),
            Err("FILE_INCOMPLETE_TRANSFER".into())
        );
        assert_eq!(
            access.append_upload(id, 1, &[1]),
            Err("FILE_INCOMPLETE_TRANSFER".into())
        );
        assert_eq!(
            access.append_upload(id, 0, &[1, 2, 3, 4]),
            Err("FILE_INCOMPLETE_TRANSFER".into())
        );
        assert_eq!(
            access.append_upload(id, 0, &vec![0; NATIVE_BLOCK_BYTES + 1]),
            Err("FILE_TOO_LARGE".into())
        );
        assert_eq!(access.append_upload(id, 0, &[1, 2]), Ok(2));
        assert_eq!(
            access.append_upload(id, 0, &[1, 2]),
            Err("FILE_INCOMPLETE_TRANSFER".into())
        );
        assert_eq!(access.append_upload(id, 2, &[3]), Ok(3));
        assert_eq!(access.take_upload(id).unwrap(), vec![1, 2, 3]);
        // The fallback length guard runs before conversion of individual JSON values.
        assert_eq!(
            raw_bytes_limit(&InvokeBody::Json(serde_json::json!(["invalid", 2])), 1),
            Err("FILE_TOO_LARGE".into())
        );
    }
    #[test]
    fn abandoned_and_stale_uploads_cannot_consume_or_abort_a_new_transfer() {
        let access = FileAccess::default();
        let old = access.begin_upload(2).unwrap();
        access.append_upload(old, 0, &[1]).unwrap();
        let current = access.begin_upload(2).unwrap();
        assert_ne!(old, current);
        access.abort_upload(old).unwrap();
        assert_eq!(
            access.append_upload(old, 0, &[2]),
            Err("FILE_INVALID_TRANSFER".into())
        );
        assert_eq!(access.take_upload(old), Err("FILE_INVALID_TRANSFER".into()));
        access.append_upload(current, 0, &[3, 4]).unwrap();
        assert_eq!(access.take_upload(current).unwrap(), vec![3, 4]);
        let cancelled = access.begin_upload(1).unwrap();
        access.abort_upload(cancelled).unwrap();
        assert_eq!(
            access.take_upload(cancelled),
            Err("FILE_INVALID_TRANSFER".into())
        );
    }
    #[test]
    fn binary_open_preserves_unicode_metadata_and_every_payload_byte() {
        use tauri::ipc::{InvokeResponseBody, IpcResponse};
        let response = opened_response(Some(OpenedFile {
            name: "Δ\nfile.csv".into(),
            path: "C:/данные/Δ.csv".into(),
            bytes: vec![10, 0, 128, 255],
        }))
        .unwrap();
        let InvokeResponseBody::Raw(bytes) = response.body().unwrap() else {
            panic!("expected raw response")
        };
        let end = bytes.iter().position(|b| *b == b'\n').unwrap();
        let header: serde_json::Value = serde_json::from_slice(&bytes[..end]).unwrap();
        assert_eq!(header["name"], "Δ\nfile.csv");
        assert_eq!(header["path"], "C:/данные/Δ.csv");
        assert_eq!(&bytes[end + 1..], &[10, 0, 128, 255]);
        let InvokeResponseBody::Raw(empty) = opened_response(None).unwrap().body().unwrap() else {
            panic!("expected raw response")
        };
        assert!(empty.is_empty());
    }
    #[test]
    fn binary_payload_and_json_fallback_preserve_bytes_and_reject_invalid_values() {
        let raw = InvokeBody::Raw(vec![0, 128, 255]);
        assert_eq!(raw_bytes(&raw).unwrap().as_ref(), &[0, 128, 255]);
        assert_eq!(
            raw_bytes(&InvokeBody::Json(serde_json::json!([0, 128, 255])))
                .unwrap()
                .as_ref(),
            &[0, 128, 255]
        );
        for value in [
            serde_json::json!([-1]),
            serde_json::json!([256]),
            serde_json::json!([1.5]),
            serde_json::json!(["1"]),
            serde_json::json!({}),
        ] {
            assert_eq!(
                raw_bytes(&InvokeBody::Json(value)),
                Err("FILE_BINARY_REQUIRED".into())
            );
        }
        assert!(project_text(raw_bytes(&InvokeBody::Raw(vec![255])).unwrap()).is_err());
    }
    #[test]
    fn image_headers_allow_only_supported_formats() {
        assert_eq!(image_extension(Some(".PNG")), Ok("png".into()));
        assert_eq!(
            image_extension(Some("../svg")),
            Err("EXPORT_UNSUPPORTED_FORMAT".into())
        );
        assert!(image_extension(None).is_err());
    }
    #[test]
    fn project_save_requires_a_granted_path_and_rejects_data_files() {
        let directory = tempfile::tempdir().unwrap();
        let project = directory.path().join("project.aph");
        let data = directory.path().join("source.csv");
        std::fs::write(&project, b"project").unwrap();
        std::fs::write(&data, b"1,2").unwrap();
        let access = FileAccess::default();
        assert!(access.granted(&project).is_err());
        access.grant(&project).unwrap();
        assert!(access.granted(&project).is_ok());
        access.grant(&data).unwrap();
        assert!(access.granted(&data).is_err());
    }

    #[test]
    fn recovery_keeps_original_path_when_its_directory_disappears() {
        let directory = tempfile::tempdir().unwrap();
        let folder = directory.path().join("removed");
        std::fs::create_dir(&folder).unwrap();
        let project = folder.join("project.aph");
        std::fs::write(&project, b"project").unwrap();
        let project = project.canonicalize().unwrap();
        let access = FileAccess::default();
        access.grant(&project).unwrap();
        std::fs::remove_file(&project).unwrap();
        std::fs::remove_dir(&folder).unwrap();
        assert!(access.known_project(&project).unwrap());
        assert!(access.granted(&project).is_err());
    }

    #[test]
    fn an_os_drop_grants_exactly_one_read_for_the_dropped_path() {
        let access = FileAccess::default();
        let dropped = PathBuf::from("dropped.csv");
        let other = PathBuf::from("private.csv");
        assert_eq!(
            access.consume_drop(&dropped),
            Err("FILE_NOT_GRANTED".into())
        );
        access.dropped.lock().unwrap().insert(dropped.clone());
        assert_eq!(access.consume_drop(&other), Err("FILE_NOT_GRANTED".into()));
        assert_eq!(access.consume_drop(&dropped), Ok(()));
        assert_eq!(
            access.consume_drop(&dropped),
            Err("FILE_NOT_GRANTED".into())
        );
    }
}
