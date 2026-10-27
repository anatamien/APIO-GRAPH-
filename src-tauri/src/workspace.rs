use serde_json::Value;
use sha2::{Digest, Sha256};
use std::{
    collections::HashSet,
    io::{Read, Seek, SeekFrom},
    path::Path,
};
pub const MAX_BYTES: u64 = 512 * 1024 * 1024;
const META_LIMIT: usize = 16 * 1024 * 1024;
fn hash(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}
fn valid_path(name: &str) -> bool {
    name == "manifest.json"
        || name
            .strip_prefix("resources/")
            .and_then(|s| s.strip_suffix(".bin"))
            .is_some_and(|s| {
                s.len() == 64
                    && s.bytes()
                        .all(|c| c.is_ascii_digit() || (b'a'..=b'f').contains(&c))
            })
}
/// Canonical workspace files place the bounded manifest first. Never execute/extract ZIP paths.
pub fn is_workspace(path: &Path) -> Result<bool, String> {
    let mut file = std::fs::File::open(path).map_err(crate::storage::file_error)?;
    let mut header = [0u8; 43];
    if file.read_exact(&mut header).is_err() {
        return Ok(false);
    }
    if &header[0..4] != b"PK\x03\x04"
        || &header[30..43] != b"manifest.json"
        || u16::from_le_bytes(header[26..28].try_into().unwrap()) != 13
        || u16::from_le_bytes(header[28..30].try_into().unwrap()) != 0
    {
        return Ok(false);
    }
    let size = u32::from_le_bytes(header[18..22].try_into().unwrap()) as usize;
    if size > META_LIMIT {
        return Err("WORKSPACE_METADATA_LIMIT".into());
    }
    let mut bytes = vec![0; size];
    file.read_exact(&mut bytes)
        .map_err(crate::storage::file_error)?;
    let value: Value = match serde_json::from_slice(&bytes) {
        Ok(v) => v,
        Err(_) => return Ok(false),
    };
    Ok(value["format"] == "APIO_GRAPH_WORKSPACE")
}
pub fn read_chunk(path: &Path, offset: u64, count: usize) -> Result<Vec<u8>, String> {
    if count > 1024 * 1024 {
        return Err("FILE_TOO_LARGE".into());
    }
    let mut file = std::fs::File::open(path).map_err(crate::storage::file_error)?;
    let length = file.metadata().map_err(crate::storage::file_error)?.len();
    if length > MAX_BYTES || offset > length || count as u64 > length - offset {
        return Err("FILE_INVALID_RANGE".into());
    }
    file.seek(SeekFrom::Start(offset))
        .map_err(crate::storage::file_error)?;
    let mut bytes = vec![0; count];
    file.read_exact(&mut bytes)
        .map_err(crate::storage::file_error)?;
    Ok(bytes)
}
/// The UI worker additionally validates every scientific schema and reference before saving.
pub fn validate(bytes: &[u8]) -> Result<(), String> {
    let entries = crate::stored_zip::read_zip(
        bytes,
        MAX_BYTES as usize,
        crate::storage::MAX_FILE_BYTES as usize,
        valid_path,
    )?;
    let raw = entries
        .get("manifest.json")
        .ok_or("WORKSPACE_INVALID_MANIFEST")?;
    if raw.len() > META_LIMIT {
        return Err("WORKSPACE_METADATA_LIMIT".into());
    }
    let m: Value = serde_json::from_slice(raw).map_err(|_| "WORKSPACE_INVALID_MANIFEST")?;
    if m["format"] != "APIO_GRAPH_WORKSPACE" || m["version"] != 1 {
        return Err("WORKSPACE_NEWER_READER".into());
    }
    let tabs = m["tabs"].as_array().ok_or("WORKSPACE_INVALID_MANIFEST")?;
    if tabs.len() > 100 || (tabs.is_empty() && !m["activeId"].is_null()) {
        return Err("WORKSPACE_TAB_LIMIT".into());
    }
    let required = m["required"]
        .as_array()
        .ok_or("WORKSPACE_INVALID_MANIFEST")?;
    if required.len() > 8
        || required
            .iter()
            .any(|v| !matches!(v.as_str(), Some("graph-1.1" | "graph-1.2" | "points-1" | "origin-oim-1")))
    {
        return Err("WORKSPACE_NEWER_READER".into());
    }
    let resources = m["resources"]
        .as_array()
        .ok_or("WORKSPACE_INVALID_MANIFEST")?;
    if resources.len() + 1 != entries.len() {
        return Err("WORKSPACE_UNLISTED_RESOURCE".into());
    }
    let mut seen = HashSet::new();
    for resource in resources {
        let h = resource["hash"].as_str().ok_or("WORKSPACE_RESOURCE_HASH")?;
        if !seen.insert(h) {
            return Err("WORKSPACE_RESOURCE_HASH".into());
        }
        let b = entries
            .get(&format!("resources/{h}.bin"))
            .ok_or("WORKSPACE_RESOURCE_HASH")?;
        if Some(b.len() as u64) != resource["size"].as_u64() || hash(b) != h {
            return Err("WORKSPACE_RESOURCE_HASH".into());
        }
    }
    let uuid = |v: &Value| {
        v.as_str().is_some_and(|s| {
            s.len() == 36
                && s.bytes().enumerate().all(|(i, c)| {
                    if [8, 13, 18, 23].contains(&i) {
                        c == b'-'
                    } else {
                        c.is_ascii_digit() || (b'a'..=b'f').contains(&c)
                    }
                })
        })
    };
    if !uuid(&m["id"]) {
        return Err("WORKSPACE_INVALID_MANIFEST".into());
    }
    let mut ids = HashSet::new();
    let mut used = HashSet::new();
    let resource = |h: &Value| -> Result<&[u8], String> {
        let h = h.as_str().ok_or("WORKSPACE_RESOURCE_MISSING")?;
        entries
            .get(&format!("resources/{h}.bin"))
            .copied()
            .ok_or("WORKSPACE_RESOURCE_MISSING".into())
    };
    for tab in tabs {
        let tid = tab["id"].as_str().ok_or("WORKSPACE_INVALID_MANIFEST")?;
        if !uuid(&tab["id"])
            || !ids.insert(tid)
            || !tab["label"].as_str().is_some_and(|s| {
                !s.is_empty() && s.chars().count() <= 1024 && !s.chars().any(char::is_control)
            })
        {
            return Err("WORKSPACE_INVALID_MANIFEST".into());
        }
        let key = match tab["kind"].as_str() {
            Some("graph") => "document",
            Some("origin") => "model",
            _ => return Err("WORKSPACE_INVALID_MANIFEST".into()),
        };
        let raw = resource(&tab[key])?;
        if raw.len() > META_LIMIT {
            return Err("WORKSPACE_METADATA_LIMIT".into());
        }
        used.insert(tab[key].as_str().unwrap().to_owned());
        let model: Value = serde_json::from_slice(raw).map_err(|_| "WORKSPACE_INVALID_MANIFEST")?;
        if key == "document" {
            if model["format"] != "APIO_GRAPH_PROJECT" {
                return Err("WORKSPACE_INVALID_GRAPH".into());
            }
            let datasets = model["datasets"]
                .as_array()
                .ok_or("WORKSPACE_INVALID_GRAPH")?;
            for dataset in datasets {
                let b = resource(&dataset["pointsResource"])?;
                used.insert(dataset["pointsResource"].as_str().unwrap().to_owned());
                if b.len() < 16 || &b[..8] != b"APIOPTS1" || b[12..16] != [4, 3, 2, 1] {
                    return Err("WORKSPACE_INVALID_POINTS".into());
                }
                let count = u32::from_le_bytes(b[8..12].try_into().unwrap()) as usize;
                if count > 1000000 || b.len() != 16 + count * 52 {
                    return Err("WORKSPACE_INVALID_POINTS".into());
                }
            }
        } else {
            if model["format"] != "APIO_ORIGIN_DOCUMENT" {
                return Err("WORKSPACE_INVALID_ORIGIN".into());
            }
            let listed = tab["resources"]
                .as_array()
                .ok_or("WORKSPACE_INVALID_ORIGIN")?;
            let expected = model["resources"]
                .as_array()
                .ok_or("WORKSPACE_INVALID_ORIGIN")?;
            if listed.len() != expected.len() {
                return Err("WORKSPACE_INVALID_ORIGIN".into());
            }
            let mut local = HashSet::new();
            for r in listed {
                let rid = r["id"].as_str().ok_or("WORKSPACE_INVALID_ORIGIN")?;
                if !local.insert(rid) {
                    return Err("WORKSPACE_INVALID_ORIGIN".into());
                }
                let e = expected
                    .iter()
                    .find(|e| e["id"] == r["id"])
                    .ok_or("WORKSPACE_INVALID_ORIGIN")?;
                let b = resource(&r["hash"])?;
                if e["sha256"] != r["hash"] || e["size"].as_u64() != Some(b.len() as u64) {
                    return Err("WORKSPACE_INVALID_ORIGIN".into());
                }
                used.insert(r["hash"].as_str().unwrap().to_owned());
            }
        }
    }
    if (!tabs.is_empty() && !m["activeId"].as_str().is_some_and(|id| ids.contains(id)))
        || used.len() != resources.len()
    {
        return Err("WORKSPACE_INVALID_MANIFEST".into());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    fn empty_archive(manifest: Value) -> Vec<u8> {
        let data = serde_json::to_vec(&manifest).unwrap();
        let name = b"manifest.json";
        let crc = crc32fast::hash(&data);
        let mut bytes = vec![0u8; 43];
        bytes[0..4].copy_from_slice(&0x04034b50u32.to_le_bytes());
        bytes[4..6].copy_from_slice(&20u16.to_le_bytes());
        bytes[14..18].copy_from_slice(&crc.to_le_bytes());
        for at in [18, 22] {
            bytes[at..at + 4].copy_from_slice(&(data.len() as u32).to_le_bytes())
        }
        bytes[26..28].copy_from_slice(&13u16.to_le_bytes());
        bytes[30..43].copy_from_slice(name);
        bytes.extend_from_slice(&data);
        let start = bytes.len();
        let mut cd = vec![0u8; 59];
        cd[0..4].copy_from_slice(&0x02014b50u32.to_le_bytes());
        cd[4..6].copy_from_slice(&20u16.to_le_bytes());
        cd[6..8].copy_from_slice(&20u16.to_le_bytes());
        cd[16..20].copy_from_slice(&crc.to_le_bytes());
        for at in [20, 24] {
            cd[at..at + 4].copy_from_slice(&(data.len() as u32).to_le_bytes())
        }
        cd[28..30].copy_from_slice(&13u16.to_le_bytes());
        cd[46..59].copy_from_slice(name);
        bytes.extend_from_slice(&cd);
        let mut end = vec![0u8; 22];
        end[0..4].copy_from_slice(&0x06054b50u32.to_le_bytes());
        end[8..10].copy_from_slice(&1u16.to_le_bytes());
        end[10..12].copy_from_slice(&1u16.to_le_bytes());
        end[12..16].copy_from_slice(&59u32.to_le_bytes());
        end[16..20].copy_from_slice(&(start as u32).to_le_bytes());
        bytes.extend_from_slice(&end);
        bytes
    }
    fn manifest() -> Value {
        json!({"format":"APIO_GRAPH_WORKSPACE","version":1,"id":"12345678-1234-4234-8234-123456789abc","required":["points-1"],"activeId":null,"tabs":[],"resources":[]})
    }
    #[test]
    fn empty_workspace_is_valid_atomic_and_chunked_without_becoming_origin() {
        let bytes = empty_archive(manifest());
        validate(&bytes).unwrap();
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("all.aph");
        crate::storage::atomic_write(&path, &bytes).unwrap();
        assert!(is_workspace(&path).unwrap());
        assert_eq!(read_chunk(&path, 0, bytes.len()).unwrap(), bytes);
        assert!(read_chunk(&path, 1, bytes.len()).is_err());
        assert!(read_chunk(&path, 0, 1024 * 1024 + 1).is_err());
    }
    #[test]
    fn corruption_versions_phantom_tabs_and_unlisted_resources_are_rejected() {
        let mut m = manifest();
        m["version"] = json!(2);
        assert!(validate(&empty_archive(m)).is_err());
        let mut m = manifest();
        m["activeId"] = json!("12345678-1234-4234-8234-123456789abc");
        assert!(validate(&empty_archive(m)).is_err());
        let mut m = manifest();
        m["tabs"] = json!([{"id":"12345678-1234-4234-8234-123456789abc","kind":"graph","label":"Phantom","document":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}]);
        assert!(validate(&empty_archive(m)).is_err());
        let bytes = empty_archive(manifest());
        for at in [0, 8, 18, 30, 43, bytes.len() - 1] {
            let mut bad = bytes.clone();
            bad[at] ^= 1;
            assert!(validate(&bad).is_err(), "mutated {at}")
        }
    }
    #[test]
    #[ignore = "own cross-language fixture; APIO_WORKSPACE_FIXTURE required"]
    fn typescript_fixture_roundtrip() {
        let path = std::env::var("APIO_WORKSPACE_FIXTURE").unwrap();
        let bytes = crate::storage::bounded_read(Path::new(&path), MAX_BYTES).unwrap();
        validate(&bytes).unwrap();
        let dir = tempfile::tempdir().unwrap();
        let dest = dir.path().join("copy.aph");
        crate::storage::atomic_write(&dest, &bytes).unwrap();
        assert!(is_workspace(&dest).unwrap());
        assert_eq!(
            read_chunk(&dest, 0, bytes.len().min(1024 * 1024)).unwrap(),
            &bytes[..bytes.len().min(1024 * 1024)]
        );
    }
}
