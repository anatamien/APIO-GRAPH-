use super::protocol::sha256;
use serde_json::{json, Value};
use std::collections::{HashMap, HashSet};
pub(super) const MAX_SOURCE: usize = 200 * 1024 * 1024;
pub(super) fn invalid() -> String {
    "ORIGIN_INVALID_MODEL".into()
}
pub(super) fn detect(bytes: &[u8]) -> Result<Value, String> {
    if bytes.len() > MAX_SOURCE {
        return Err("ORIGIN_TOO_LARGE".into());
    }
    let lf = bytes.iter().take(512).position(|b| *b == 10);
    let header = String::from_utf8_lossy(&bytes[..lf.unwrap_or(bytes.len().min(80))])
        .trim_end_matches('\r')
        .to_string();
    let family = if header.starts_with("CPYA ") {
        "opj"
    } else if header.starts_with("CPYUA ") {
        "opju"
    } else {
        "unknown"
    };
    if family == "unknown" {
        return Ok(
            json!({"family":family,"header":header,"build":null,"version":null,"canDecode":false,"reason":"UNKNOWN_SIGNATURE"}),
        );
    }
    let at = lf.ok_or("ORIGIN_TRUNCATED")? + 1;
    if at + 5 > bytes.len() {
        return Err("ORIGIN_TRUNCATED".into());
    }
    let n = u32::from_le_bytes(bytes[at..at + 4].try_into().unwrap()) as usize;
    let body = at + 5;
    if bytes[at + 4] != 10
        || !(35..=4096).contains(&n)
        || n >= bytes.len() - body
        || bytes[body + n] != 10
    {
        return Err("ORIGIN_TRUNCATED".into());
    }
    let version = f64::from_le_bytes(bytes[body + 27..body + 35].try_into().unwrap());
    let build = header
        .split([',', '.'])
        .nth(1)
        .and_then(|s| s.split_whitespace().next())
        .and_then(|s| s.parse::<u32>().ok());
    let profiles = [
        (2878, 8.0724_f64),
        (3116, 9.200272),
        (3168, 9.300226),
        (3478, 9.850212),
        (3522, 9.900225),
        (3551, 9.950167),
    ];
    let can_decode = family == "opj"
        && (header.starts_with("CPYA 4,") || header.starts_with("CPYA 4."))
        && version.is_finite()
        && profiles
            .iter()
            .any(|(b, v)| build == Some(*b) && (version - v).abs() < 1e-10);
    let mut result = json!({"family":family,"header":header,"build":build,"version":if version.is_finite(){Some(version)}else{None},"canDecode":can_decode});
    if !can_decode {
        result["reason"] = json!("UNVERIFIED_PROFILE")
    }
    Ok(result)
}
pub(super) fn archive_only(name: &str, source: &[u8]) -> Value {
    let detected=detect(source).unwrap_or_else(|_|json!({"family":"unknown","header":"","build":null,"version":null,"canDecode":false,"reason":"UNKNOWN_SIGNATURE"}));
    json!({"format":"APIO_ORIGIN_DOCUMENT","schemaVersion":1,
    "source":{"name":name,"size":source.len(),"sha256":sha256(source),"detected":detected},
    "decoder":{"name":"archive-only","version":"1","revision":"oim-1"},
    "nodes":[{"id":"source","parentId":null,"kind":"opaque","nameHex":hex(name.as_bytes()),"sourceId":null,"properties":{"nameEncoding":"utf-8"},"provenance":[{"offset":0,"length":source.len()}],"capabilities":{"recognized":false,"extracted":false,"rendered":false,"editable":false,"recalculable":false,"archived":true,"unsupportedReason":"UNVERIFIED_PROFILE"}}],
    "columns":[],"relations":[],"resources":[{"id":"original","kind":"original","size":source.len(),"sha256":sha256(source)}],
    "diagnostics":[{"code":"ARCHIVE_ONLY","severity":"warning","nodeId":null,"offset":null}],
    "coverage":{"inventory":"partial","visualEquivalence":"unverified","opaqueRanges":[{"offset":0,"length":source.len()}]},"sourceResourceId":"original"})
}
pub(super) fn hex(bytes: &[u8]) -> String {
    const H: &[u8] = b"0123456789abcdef";
    let mut out = String::with_capacity(bytes.len() * 2);
    for b in bytes {
        out.push(H[(b >> 4) as usize] as char);
        out.push(H[(b & 15) as usize] as char);
    }
    out
}
fn hash(v: &Value) -> bool {
    v.as_str().is_some_and(|s| {
        s.len() == 64
            && s.bytes()
                .all(|c| c.is_ascii_digit() || (b'a'..=b'f').contains(&c))
    })
}
fn array<'a>(m: &'a Value, key: &str, limit: usize) -> Result<&'a Vec<Value>, String> {
    let a = m[key].as_array().ok_or_else(invalid)?;
    if a.len() > limit {
        return Err(invalid());
    }
    Ok(a)
}
pub(super) fn validate_model(m: &Value) -> Result<(), String> {
    if m["format"] != "APIO_ORIGIN_DOCUMENT"
        || m["schemaVersion"] != 1
        || m["source"]["name"].as_str().is_none_or(|s| s.len() > 4096)
        || !hash(&m["source"]["sha256"])
        || m["source"]["size"]
            .as_u64()
            .is_none_or(|n| n > MAX_SOURCE as u64)
        || m["coverage"]["visualEquivalence"] != "unverified"
        || !matches!(
            m["coverage"]["inventory"].as_str(),
            Some("partial" | "complete")
        )
    {
        return Err(invalid());
    }
    let source_size = m["source"]["size"].as_u64().unwrap();
    let check_range = |r: &Value| -> Result<(), String> {
        let at = r["offset"].as_u64().ok_or_else(invalid)?;
        let len = r["length"].as_u64().ok_or_else(invalid)?;
        if at > source_size || len > source_size - at {
            return Err(invalid());
        }
        Ok(())
    };
    for r in array(&m["coverage"], "opaqueRanges", 100000)? {
        check_range(r)?
    }
    let resources = array(m, "resources", 100000)?;
    let mut rs = HashMap::new();
    let mut total = 0u64;
    for r in resources {
        let id = r["id"].as_str().ok_or_else(invalid)?;
        let size = r["size"].as_u64().ok_or_else(invalid)?;
        if id.is_empty()
            || id.len() > 256
            || rs.insert(id, r).is_some()
            || !hash(&r["sha256"])
            || !matches!(
                r["kind"].as_str(),
                Some("original" | "opaque" | "f64" | "tags" | "offsets" | "text")
            )
        {
            return Err(invalid());
        }
        total = total.checked_add(size).ok_or_else(invalid)?;
        if total > 1024 * 1024 * 1024 {
            return Err(invalid());
        }
    }
    if !m["sourceResourceId"].is_null() {
        let id = m["sourceResourceId"].as_str().ok_or_else(invalid)?;
        let r = rs.get(id).ok_or_else(invalid)?;
        if r["kind"] != "original"
            || r["size"] != m["source"]["size"]
            || r["sha256"] != m["source"]["sha256"]
        {
            return Err(invalid());
        }
    }
    let nodes = array(m, "nodes", 100000)?;
    let mut ns = HashMap::new();
    for n in nodes {
        let id = n["id"].as_str().ok_or_else(invalid)?;
        let name = n["nameHex"].as_str().ok_or_else(invalid)?;
        if id.is_empty()
            || id.len() > 256
            || ns.insert(id, n).is_some()
            || name.len() > 65536
            || name.len() % 2 != 0
            || !name
                .bytes()
                .all(|c| c.is_ascii_hexdigit() && !c.is_ascii_uppercase())
            || !matches!(
                n["kind"].as_str(),
                Some(
                    "folder"
                        | "workbook"
                        | "worksheet"
                        | "column"
                        | "graph"
                        | "layer"
                        | "curve"
                        | "text"
                        | "matrix"
                        | "note"
                        | "attachment"
                        | "opaque"
                )
            )
            || !n["properties"].is_object()
        {
            return Err(invalid());
        }
        let c = &n["capabilities"];
        for (key, value) in n["properties"].as_object().ok_or_else(invalid)? {
            if key.ends_with("Hex")
                && value.as_str().is_none_or(|v| {
                    v.len() % 2 != 0
                        || !v
                            .bytes()
                            .all(|c| c.is_ascii_hexdigit() && !c.is_ascii_uppercase())
                })
            {
                return Err(invalid());
            }
        }
        for k in ["recognized", "extracted"] {
            if !c[k].is_null() && !c[k].is_boolean() {
                return Err(invalid());
            }
        }
        for k in ["rendered", "editable", "recalculable", "archived"] {
            if !c[k].is_boolean() {
                return Err(invalid());
            }
        }
        if c["editable"] != false || c["recalculable"] != false {
            return Err(invalid());
        }
        for r in array(n, "provenance", 100000)? {
            check_range(r)?
        }
    }
    for n in nodes {
        let mut current = n;
        let mut visited = HashSet::new();
        for _ in 0..=128 {
            let id = current["id"].as_str().ok_or_else(invalid)?;
            if !visited.insert(id) {
                return Err(invalid());
            }
            if current["parentId"].is_null() {
                break;
            }
            current = ns
                .get(current["parentId"].as_str().ok_or_else(invalid)?)
                .ok_or_else(invalid)?;
            if visited.len() >= 128 {
                return Err(invalid());
            }
        }
    }
    let mut cs = HashSet::new();
    for c in array(m, "columns", 100000)? {
        let id = c["nodeId"].as_str().ok_or_else(invalid)?;
        if ns.get(id).is_none_or(|n| n["kind"] != "column") || !cs.insert(id) {
            return Err(invalid());
        }
        let rows = c["rowCount"].as_u64().ok_or_else(invalid)?;
        if rows > 100000000 {
            return Err(invalid());
        }
        for (key, kind, size) in [("values", "f64", rows * 8), ("tags", "tags", rows)] {
            let r = rs
                .get(c[key].as_str().ok_or_else(invalid)?)
                .ok_or_else(invalid)?;
            if r["kind"] != kind || r["size"].as_u64() != Some(size) {
                return Err(invalid());
            }
        }
        if !c["textOffsets"].is_null() || !c["textBytes"].is_null() {
            let r = rs
                .get(c["textOffsets"].as_str().ok_or_else(invalid)?)
                .ok_or_else(invalid)?;
            let t = rs
                .get(c["textBytes"].as_str().ok_or_else(invalid)?)
                .ok_or_else(invalid)?;
            if r["kind"] != "offsets"
                || r["size"].as_u64() != Some((rows + 1) * 4)
                || t["kind"] != "text"
            {
                return Err(invalid());
            }
        }
    }
    let mut relations = HashSet::new();
    for r in array(m, "relations", 200000)? {
        let id = r["id"].as_str().ok_or_else(invalid)?;
        if !relations.insert(id)
            || !ns.contains_key(r["from"].as_str().ok_or_else(invalid)?)
            || r["resolved"].as_bool() != Some(!r["to"].is_null())
            || (!r["to"].is_null() && !ns.contains_key(r["to"].as_str().ok_or_else(invalid)?))
        {
            return Err(invalid());
        }
    }
    array(m, "diagnostics", 100000)?;
    if serde_json::to_vec(m).map_err(|_| invalid())?.len() > 16 * 1024 * 1024 {
        return Err(invalid());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    #[test]
    fn archive_only_is_honest_and_source_preserving() {
        let source = b"an unknown format".to_vec();
        let model = archive_only("own.opju", &source);
        assert_eq!(model["source"]["sha256"], sha256(&source));
        assert_eq!(model["coverage"]["inventory"], "partial");
        assert_eq!(model["source"]["detected"]["canDecode"], false);
        assert_eq!(model["nodes"][0]["capabilities"]["extracted"], false);
        validate_model(&model).unwrap();
        let mut malformed = model.clone();
        malformed["nodes"][0]["properties"]["labelHex"] = json!("not hex");
        assert!(validate_model(&malformed).is_err());
        let mut wrong = model;
        wrong["nodes"][0]["capabilities"]["recalculable"] = json!(true);
        assert!(validate_model(&wrong).is_err());
    }
    #[test]
    fn raw_signature_and_global_version_both_gate_decoder() {
        let header = b"CPYA 4,3168 226 W64 #\n";
        let mut bytes = header.to_vec();
        bytes.extend(64u32.to_le_bytes());
        bytes.push(10);
        let start = bytes.len();
        bytes.resize(start + 65, 0);
        bytes[start + 64] = 10;
        bytes[start + 27..start + 35].copy_from_slice(&9.300226f64.to_le_bytes());
        assert_eq!(detect(&bytes).unwrap()["canDecode"], true);
        bytes[start + 27..start + 35].copy_from_slice(&8.5f64.to_le_bytes());
        assert_eq!(detect(&bytes).unwrap()["canDecode"], false);
        assert!(detect(&bytes[..30]).is_err());
    }
}
