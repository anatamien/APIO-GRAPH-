use super::{
    broker::{session_from_bytes, Session},
    document::{self, MAX_SOURCE},
    protocol::sha256,
};
use serde_json::{json, Value};
use std::collections::{BTreeMap, HashSet};
fn error() -> String {
    "ORIGIN_INVALID_ARCHIVE".into()
}
fn valid_path(s: &str) -> bool {
    s == "manifest.json"
        || s == "model.json"
        || s == "recovery.json"
        || (s.starts_with("resources/")
            && s.ends_with(".bin")
            && s.len() > 14
            && s.len() < 100
            && s[10..s.len() - 4].bytes().all(|c| c.is_ascii_digit()))
        || (s.starts_with("tabs/")
            && s.ends_with(".aph")
            && s.len() > 9
            && s.len() < 100
            && s[5..s.len() - 4].bytes().all(|c| c.is_ascii_digit()))
}
fn w(out: &mut Vec<u8>, n: u16) {
    out.extend(n.to_le_bytes())
}
fn d(out: &mut Vec<u8>, n: u32) {
    out.extend(n.to_le_bytes())
}
// Stored-only ZIP v1 has no decompressor, filesystem extraction or path traversal.
pub(super) fn write_zip(entries: &[(String, Vec<u8>)]) -> Result<Vec<u8>, String> {
    if entries.len() > 60000 {
        return Err(error());
    }
    let mut seen = HashSet::new();
    let mut out = Vec::new();
    let mut central = Vec::new();
    for (name, bytes) in entries {
        if !valid_path(name)
            || !seen.insert(name)
            || out.len() + bytes.len() + name.len() + 100 > MAX_SOURCE
        {
            return Err("ORIGIN_ARCHIVE_LIMIT".into());
        }
        let offset = out.len() as u32;
        let crc = crc32fast::hash(bytes);
        d(&mut out, 0x04034b50);
        w(&mut out, 20);
        w(&mut out, 0);
        w(&mut out, 0);
        w(&mut out, 0);
        w(&mut out, 0);
        d(&mut out, crc);
        d(&mut out, bytes.len() as u32);
        d(&mut out, bytes.len() as u32);
        w(&mut out, name.len() as u16);
        w(&mut out, 0);
        out.extend(name.as_bytes());
        out.extend(bytes);
        d(&mut central, 0x02014b50);
        w(&mut central, 20);
        w(&mut central, 20);
        w(&mut central, 0);
        w(&mut central, 0);
        w(&mut central, 0);
        w(&mut central, 0);
        d(&mut central, crc);
        d(&mut central, bytes.len() as u32);
        d(&mut central, bytes.len() as u32);
        w(&mut central, name.len() as u16);
        w(&mut central, 0);
        w(&mut central, 0);
        w(&mut central, 0);
        w(&mut central, 0);
        d(&mut central, 0);
        d(&mut central, offset);
        central.extend(name.as_bytes());
    }
    let start = out.len();
    if start + central.len() + 22 > MAX_SOURCE {
        return Err("ORIGIN_ARCHIVE_LIMIT".into());
    }
    out.extend(&central);
    d(&mut out, 0x06054b50);
    w(&mut out, 0);
    w(&mut out, 0);
    w(&mut out, entries.len() as u16);
    w(&mut out, entries.len() as u16);
    d(&mut out, central.len() as u32);
    d(&mut out, start as u32);
    w(&mut out, 0);
    Ok(out)
}
pub(super) fn read_zip(bytes: &[u8]) -> Result<BTreeMap<String, Vec<u8>>, String> {
    crate::stored_zip::read_zip(bytes, MAX_SOURCE, MAX_SOURCE, valid_path)
        .map(|entries| entries.into_iter().map(|(k, v)| (k, v.to_vec())).collect())
        .map_err(|_| error())
}
pub(super) fn validate_view(view: &Value, model: &Value) -> Result<(), String> {
    if !view.is_object()
        || !matches!(
            view["encoding"].as_str(),
            Some("utf-8" | "windows-1251" | "windows-1252" | "shift_jis")
        )
        || !view["includeSource"].is_boolean()
    {
        return Err("ORIGIN_INVALID_VIEW".into());
    }
    let ids: HashSet<_> = model["nodes"]
        .as_array()
        .ok_or_else(error)?
        .iter()
        .filter_map(|n| n["id"].as_str())
        .collect();
    if !view["selectedId"].is_null()
        && !view["selectedId"].as_str().is_some_and(|s| ids.contains(s))
    {
        return Err("ORIGIN_INVALID_VIEW".into());
    }
    let included = view["includedIds"]
        .as_array()
        .ok_or("ORIGIN_INVALID_VIEW")?;
    let mut seen = HashSet::new();
    if included.len() > ids.len() {
        return Err("ORIGIN_INVALID_VIEW".into());
    }
    for id in included {
        let id = id.as_str().ok_or("ORIGIN_INVALID_VIEW")?;
        if !ids.contains(id) || !seen.insert(id) {
            return Err("ORIGIN_INVALID_VIEW".into());
        }
    }
    Ok(())
}
pub(super) fn encode(session: &Session, view: &Value) -> Result<Vec<u8>, String> {
    validate_view(view, &session.model)?;
    let mut model = session.model.clone();
    let include = view["includeSource"] == true;
    let source_id = model["sourceResourceId"].as_str().map(str::to_string);
    if !include {
        model["sourceResourceId"] = Value::Null;
        for n in model["nodes"].as_array_mut().ok_or_else(error)? {
            n["capabilities"]["archived"] = json!(false)
        }
    }
    model["resources"]
        .as_array_mut()
        .ok_or_else(error)?
        .retain(|r| include || r["id"].as_str() != source_id.as_deref());
    document::validate_model(&model)?;
    let model_bytes = serde_json::to_vec(&model).map_err(|_| error())?;
    let mut entries = vec![("model.json".into(), model_bytes.clone())];
    let mut listed = vec![];
    for (i, r) in model["resources"]
        .as_array()
        .ok_or_else(error)?
        .iter()
        .enumerate()
    {
        let id = r["id"].as_str().ok_or_else(error)?;
        let path = session.resources.get(id).ok_or_else(error)?;
        let bytes = crate::storage::bounded_read(path, MAX_SOURCE as u64)
            .map_err(crate::storage::file_error)?;
        if r["sha256"] != sha256(&bytes) || r["size"].as_u64() != Some(bytes.len() as u64) {
            return Err("ORIGIN_RESOURCE_HASH".into());
        }
        let name = format!("resources/{i}.bin");
        listed.push(json!({"id":id,"path":name}));
        entries.push((name, bytes));
    }
    let manifest = json!({"format":"APIO_ORIGIN_CONTAINER","version":1,"minimumReader":"1.4","modelSHA256":sha256(&model_bytes),"view":view,"resources":listed});
    entries.insert(
        0,
        (
            "manifest.json".into(),
            serde_json::to_vec(&manifest).map_err(|_| error())?,
        ),
    );
    write_zip(&entries)
}
pub(super) fn decode(bytes: &[u8]) -> Result<(Session, Value), String> {
    let mut entries = read_zip(bytes)?;
    let manifest_bytes = entries.remove("manifest.json").ok_or_else(error)?;
    if manifest_bytes.len() > 16 * 1024 * 1024 {
        return Err(error());
    }
    let manifest: Value = serde_json::from_slice(&manifest_bytes).map_err(|_| error())?;
    if manifest["format"] != "APIO_ORIGIN_CONTAINER"
        || manifest["version"] != 1
        || manifest["minimumReader"] != "1.4"
    {
        return Err("ORIGIN_ARCHIVE_VERSION".into());
    }
    let model_bytes = entries.remove("model.json").ok_or_else(error)?;
    if model_bytes.len() > 16 * 1024 * 1024 || manifest["modelSHA256"] != sha256(&model_bytes) {
        return Err("ORIGIN_RESOURCE_HASH".into());
    }
    let model: Value = serde_json::from_slice(&model_bytes).map_err(|_| error())?;
    document::validate_model(&model)?;
    validate_view(&manifest["view"], &model)?;
    let mut resources = BTreeMap::new();
    for r in manifest["resources"].as_array().ok_or_else(error)? {
        let id = r["id"].as_str().ok_or_else(error)?;
        let path = r["path"].as_str().ok_or_else(error)?;
        if !path.starts_with("resources/") || !valid_path(path) || resources.contains_key(id) {
            return Err(error());
        }
        let bytes = entries.remove(path).ok_or_else(error)?;
        resources.insert(id.into(), bytes);
    }
    if !entries.is_empty() {
        return Err(error());
    }
    let session = session_from_bytes(model, resources)?;
    Ok((session, manifest["view"].clone()))
}

#[cfg(test)]
mod tests {
    use super::super::{broker::session_from_bytes, document};
    use super::*;
    use std::collections::BTreeMap;
    #[test]
    fn source_archive_is_self_contained_and_hash_checked() {
        let source = b"own binary source\0\xff".to_vec();
        let model = document::archive_only("own.opju", &source);
        let session =
            session_from_bytes(model, BTreeMap::from([("original".into(), source.clone())]))
                .unwrap();
        let bytes=encode(&session,&serde_json::json!({"encoding":"windows-1251","selectedId":null,"includedIds":["source"],"includeSource":true})).unwrap();
        assert_eq!(&bytes[..4], b"PK\x03\x04");
        let (restored, view) = decode(&bytes).unwrap();
        assert_eq!(
            std::fs::read(&restored.resources["original"]).unwrap(),
            source
        );
        assert_eq!(view["encoding"], "windows-1251");
        let mut bad = bytes;
        bad[40] ^= 1;
        assert!(decode(&bad).is_err());
    }
    #[test]
    fn explicit_source_exclusion_never_claims_l0() {
        let source = b"own source".to_vec();
        let session = session_from_bytes(
            document::archive_only("x.opju", &source),
            BTreeMap::from([("original".into(), source)]),
        )
        .unwrap();
        let bytes=encode(&session,&serde_json::json!({"encoding":"utf-8","selectedId":null,"includedIds":["source"],"includeSource":false})).unwrap();
        let (restored, _) = decode(&bytes).unwrap();
        assert!(restored.model["sourceResourceId"].is_null());
        assert!(restored.resources.is_empty());
        assert_eq!(
            restored.model["nodes"][0]["capabilities"]["archived"],
            false
        );
    }
    #[test]
    fn unsafe_duplicate_and_compressed_paths_never_extract() {
        assert!(!valid_path("resources/.bin"));
        assert!(!valid_path("tabs/.aph"));
        assert!(write_zip(&[("../escape".into(), vec![])]).is_err());
        assert!(write_zip(&[
            ("manifest.json".into(), vec![]),
            ("manifest.json".into(), vec![])
        ])
        .is_err());
        let mut bytes = write_zip(&[("manifest.json".into(), b"own".to_vec())]).unwrap();
        bytes[8] = 8;
        assert!(read_zip(&bytes).is_err());
    }
}
