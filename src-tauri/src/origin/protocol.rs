use serde_json::Value;
use sha2::{Digest, Sha256};
use std::{
    collections::{BTreeMap, HashSet},
    io::Read,
};

pub(super) const MAX_RESOURCE_BYTES: usize = 1024 * 1024 * 1024;
#[cfg(test)]
pub(super) struct Decoded {
    pub metadata: Value,
    pub resources: BTreeMap<String, Vec<u8>>,
}
pub(super) struct DiskDecoded {
    pub metadata: Value,
    pub resources: BTreeMap<String, std::path::PathBuf>,
    pub directory: tempfile::TempDir,
}
pub(super) fn sha256(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}
fn fail() -> String {
    "ORIGIN_INVALID_PROTOCOL".into()
}
/// Production IPC spills each bounded chunk to a private file, never a GiB Vec.
pub(super) fn read_protocol_on_disk(mut input: impl Read) -> Result<DiskDecoded, String> {
    use std::{fs::File, io::Write};
    struct Resource {
        file: File,
        expected: usize,
        written: usize,
        hash: Sha256,
    }
    let directory = tempfile::Builder::new()
        .prefix("apio-origin-stream-")
        .tempdir()
        .map_err(|_| fail())?;
    let mut magic = [0; 8];
    input.read_exact(&mut magic).map_err(|_| fail())?;
    if &magic != b"APIOOIM1" {
        return Err(fail());
    }
    let mut resources: BTreeMap<String, Resource> = BTreeMap::new();
    let mut paths = BTreeMap::new();
    let mut total = 0usize;
    let mut metadata = None;
    loop {
        let mut header = [0; 5];
        input.read_exact(&mut header).map_err(|_| fail())?;
        let size = u32::from_le_bytes(header[..4].try_into().unwrap()) as usize;
        if size == 0 || size > 8 * 1024 * 1024 {
            return Err(fail());
        }
        let mut bytes = vec![0; size - 1];
        input.read_exact(&mut bytes).map_err(|_| fail())?;
        match header[4] {
            1 => {
                if metadata.is_some() {
                    return Err(fail());
                }
                metadata = Some(serde_json::from_slice::<Value>(&bytes).map_err(|_| fail())?);
            }
            2 => {
                if bytes.len() < 12 || bytes.len() > 1024 * 1024 + 12 {
                    return Err(fail());
                }
                let word =
                    |at: usize| u32::from_le_bytes(bytes[at..at + 4].try_into().unwrap()) as usize;
                let (id, offset, length) = (word(0), word(4), word(8));
                if id >= 100000
                    || length > 200 * 1024 * 1024
                    || offset > length
                    || bytes.len() - 12 > length - offset
                {
                    return Err(fail());
                }
                let key = format!("r{id}");
                if !resources.contains_key(&key) {
                    if offset != 0 {
                        return Err(fail());
                    }
                    total = total.checked_add(length).ok_or_else(fail)?;
                    if total > MAX_RESOURCE_BYTES {
                        return Err(fail());
                    }
                    let path = directory.path().join(format!("{id}.bin"));
                    let file = File::create(&path).map_err(|_| fail())?;
                    paths.insert(key.clone(), path);
                    resources.insert(
                        key.clone(),
                        Resource {
                            file,
                            expected: length,
                            written: 0,
                            hash: Sha256::new(),
                        },
                    );
                }
                let r = resources.get_mut(&key).unwrap();
                if r.written != offset || r.expected != length {
                    return Err(fail());
                }
                r.file.write_all(&bytes[12..]).map_err(|_| fail())?;
                r.hash.update(&bytes[12..]);
                r.written += bytes.len() - 12;
            }
            3 => {
                if bytes.len() > 4096 {
                    return Err(fail());
                }
                let _: Value = serde_json::from_slice(&bytes).map_err(|_| fail())?;
            }
            4 => {
                if !bytes.is_empty() {
                    return Err(fail());
                }
                break;
            }
            _ => return Err(fail()),
        }
    }
    let mut extra = [0; 1];
    if input.read(&mut extra).map_err(|_| fail())? != 0 {
        return Err(fail());
    }
    let mut metadata = metadata.ok_or_else(fail)?;
    let listed = metadata["resources"].as_array_mut().ok_or_else(fail)?;
    if listed.len() != resources.len() {
        return Err(fail());
    }
    let mut seen = HashSet::new();
    for entry in listed {
        let id = entry["id"].as_str().ok_or_else(fail)?;
        if !seen.insert(id.to_string()) {
            return Err(fail());
        }
        let mut r = resources.remove(id).ok_or_else(fail)?;
        if r.written != r.expected || entry["size"].as_u64() != Some(r.written as u64) {
            return Err(fail());
        }
        r.file.flush().map_err(|_| fail())?;
        entry.as_object_mut().ok_or_else(fail)?.insert(
            "sha256".into(),
            Value::String(format!("{:x}", r.hash.finalize())),
        );
    }
    Ok(DiskDecoded {
        metadata,
        resources: paths,
        directory,
    })
}
#[cfg(test)]
pub(super) fn read_protocol(mut input: impl Read) -> Result<Decoded, String> {
    let mut magic = [0; 8];
    input.read_exact(&mut magic).map_err(|_| fail())?;
    if &magic != b"APIOOIM1" {
        return Err(fail());
    }
    let mut metadata = None;
    let mut resources: BTreeMap<String, Vec<u8>> = BTreeMap::new();
    let mut expected = BTreeMap::new();
    let mut total = 0usize;
    loop {
        let mut header = [0; 5];
        input.read_exact(&mut header).map_err(|_| fail())?;
        let size = u32::from_le_bytes(header[..4].try_into().unwrap()) as usize;
        if size == 0 || size > 8 * 1024 * 1024 {
            return Err(fail());
        }
        let mut bytes = vec![0; size - 1];
        input.read_exact(&mut bytes).map_err(|_| fail())?;
        match header[4] {
            1 => {
                if metadata.is_some() {
                    return Err(fail());
                }
                metadata = Some(serde_json::from_slice::<Value>(&bytes).map_err(|_| fail())?);
            }
            2 => {
                if bytes.len() < 12 || bytes.len() > 1024 * 1024 + 12 {
                    return Err(fail());
                }
                let word =
                    |at: usize| u32::from_le_bytes(bytes[at..at + 4].try_into().unwrap()) as usize;
                let index = word(0);
                let offset = word(4);
                let length = word(8);
                if index >= 100000
                    || length > 200 * 1024 * 1024
                    || offset > length
                    || bytes.len() - 12 > length - offset
                {
                    return Err(fail());
                }
                let key = format!("r{index}");
                if !expected.contains_key(&key) {
                    if offset != 0 {
                        return Err(fail());
                    }
                    total = total.checked_add(length).ok_or_else(fail)?;
                    if total > MAX_RESOURCE_BYTES {
                        return Err(fail());
                    }
                    expected.insert(key.clone(), length);
                }
                if expected[&key] != length {
                    return Err(fail());
                }
                let value = resources.entry(key).or_default();
                if value.len() != offset {
                    return Err(fail());
                }
                value.extend_from_slice(&bytes[12..]);
            }
            3 => {
                if bytes.len() > 4096 {
                    return Err(fail());
                }
                let _: Value = serde_json::from_slice(&bytes).map_err(|_| fail())?;
            }
            4 => {
                if !bytes.is_empty() {
                    return Err(fail());
                }
                break;
            }
            _ => return Err(fail()),
        }
    }
    let mut extra = [0; 1];
    if input.read(&mut extra).map_err(|_| fail())? != 0 {
        return Err(fail());
    }
    let mut metadata = metadata.ok_or_else(fail)?;
    let listed = metadata
        .get_mut("resources")
        .and_then(Value::as_array_mut)
        .ok_or_else(fail)?;
    if listed.len() != resources.len() {
        return Err(fail());
    }
    let mut seen = HashSet::new();
    for entry in listed {
        let id = entry
            .get("id")
            .and_then(Value::as_str)
            .ok_or_else(fail)?
            .to_string();
        if !seen.insert(id.clone()) {
            return Err(fail());
        }
        let value = resources.get(&id).ok_or_else(fail)?;
        if value.len() != *expected.get(&id).ok_or_else(fail)?
            || entry.get("size").and_then(Value::as_u64) != Some(value.len() as u64)
        {
            return Err(fail());
        }
        entry
            .as_object_mut()
            .ok_or_else(fail)?
            .insert("sha256".into(), Value::String(sha256(value)));
    }
    Ok(Decoded {
        metadata,
        resources,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Cursor;
    fn frame(kind: u8, bytes: &[u8]) -> Vec<u8> {
        let mut out = ((bytes.len() + 1) as u32).to_le_bytes().to_vec();
        out.push(kind);
        out.extend(bytes);
        out
    }
    #[test]
    fn validates_framing_and_retains_exact_resource_bytes() {
        let mut bytes = b"APIOOIM1".to_vec();
        let mut part = vec![];
        for n in [0u32, 0, 3] {
            part.extend(n.to_le_bytes());
        }
        part.extend([0, 14, 255]);
        bytes.extend(frame(2, &part));
        bytes.extend(frame(
            1,
            br#"{"resources":[{"id":"r0","kind":"opaque","size":3}]}"#,
        ));
        bytes.extend(frame(4, &[]));
        let result = read_protocol(Cursor::new(bytes)).unwrap();
        assert_eq!(result.resources["r0"], vec![0, 14, 255]);
        assert_eq!(
            result.metadata["resources"][0]["sha256"],
            sha256(&[0, 14, 255])
        );
    }
    #[test]
    fn disk_pipeline_checks_offsets_and_hashes_without_growing_a_full_resource_buffer() {
        let mut bytes = b"APIOOIM1".to_vec();
        let mut part = vec![];
        for n in [0u32, 0, 3] {
            part.extend(n.to_le_bytes());
        }
        part.extend([0, 14, 255]);
        bytes.extend(frame(2, &part));
        bytes.extend(frame(
            1,
            br#"{"resources":[{"id":"r0","kind":"opaque","size":3}]}"#,
        ));
        bytes.extend(frame(4, &[]));
        let decoded = read_protocol_on_disk(Cursor::new(bytes.clone())).unwrap();
        assert_eq!(
            std::fs::read(&decoded.resources["r0"]).unwrap(),
            [0, 14, 255]
        );
        assert_eq!(
            decoded.metadata["resources"][0]["sha256"],
            sha256(&[0, 14, 255])
        );
        bytes[17] = 1;
        assert!(read_protocol_on_disk(Cursor::new(bytes)).is_err());
    }
    #[test]
    fn rejects_partial_oversized_duplicate_and_substituted_streams() {
        for bytes in [
            b"bad".to_vec(),
            b"APIOOIM1\xff\xff\xff\xff".to_vec(),
            b"APIOOIM1\x01\0\0\0\x04".to_vec(),
        ] {
            assert!(read_protocol(Cursor::new(bytes)).is_err());
        }
        let mut bytes = b"APIOOIM1".to_vec();
        bytes.extend(frame(1, br#"{"resources":[]}"#));
        bytes.extend(frame(1, br#"{"resources":[]}"#));
        bytes.extend(frame(4, &[]));
        assert!(read_protocol(Cursor::new(bytes)).is_err());
    }
}
