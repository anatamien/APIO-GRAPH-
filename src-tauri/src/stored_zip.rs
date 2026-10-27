use std::collections::BTreeMap;
fn error() -> String {
    "CONTAINER_INVALID_ARCHIVE".into()
}
fn word(bytes: &[u8], at: usize) -> Result<u16, String> {
    Ok(u16::from_le_bytes(
        bytes.get(at..at + 2).ok_or_else(error)?.try_into().unwrap(),
    ))
}
fn dword(bytes: &[u8], at: usize) -> Result<u32, String> {
    Ok(u32::from_le_bytes(
        bytes.get(at..at + 4).ok_or_else(error)?.try_into().unwrap(),
    ))
}
pub fn read_zip(
    bytes: &[u8],
    limit: usize,
    entry_limit: usize,
    valid_path: impl Fn(&str) -> bool,
) -> Result<BTreeMap<String, &[u8]>, String> {
    if bytes.len() < 22 || bytes.len() > limit {
        return Err(error());
    }
    let end = bytes.len() - 22;
    if dword(bytes, end)? != 0x06054b50
        || word(bytes, end + 4)? != 0
        || word(bytes, end + 6)? != 0
        || word(bytes, end + 20)? != 0
    {
        return Err(error());
    }
    let count = word(bytes, end + 10)? as usize;
    if count > 60000 || word(bytes, end + 8)? as usize != count {
        return Err(error());
    }
    let length = dword(bytes, end + 12)? as usize;
    let start = dword(bytes, end + 16)? as usize;
    if start > end || length != end - start {
        return Err(error());
    }
    let mut at = start;
    let mut local = 0usize;
    let mut entries = BTreeMap::new();
    for _ in 0..count {
        if at > end
            || end - at < 46
            || dword(bytes, at)? != 0x02014b50
            || word(bytes, at + 8)? != 0
            || word(bytes, at + 10)? != 0
            || word(bytes, at + 30)? != 0
            || word(bytes, at + 32)? != 0
            || word(bytes, at + 34)? != 0
            || dword(bytes, at + 38)? != 0
            || dword(bytes, at + 42)? as usize != local
        {
            return Err(error());
        }
        let crc = dword(bytes, at + 16)?;
        let size = dword(bytes, at + 24)? as usize;
        if size > entry_limit || dword(bytes, at + 20)? as usize != size {
            return Err(error());
        }
        let name_len = word(bytes, at + 28)? as usize;
        let name = std::str::from_utf8(bytes.get(at + 46..at + 46 + name_len).ok_or_else(error)?)
            .map_err(|_| error())?
            .to_string();
        if !valid_path(&name) || entries.contains_key(&name) {
            return Err(error());
        }
        if local > start
            || start - local < 30
            || dword(bytes, local)? != 0x04034b50
            || word(bytes, local + 6)? != 0
            || word(bytes, local + 8)? != 0
            || dword(bytes, local + 14)? != crc
            || dword(bytes, local + 18)? as usize != size
            || dword(bytes, local + 22)? as usize != size
            || word(bytes, local + 26)? as usize != name_len
            || word(bytes, local + 28)? != 0
        {
            return Err(error());
        }
        if bytes.get(local + 30..local + 30 + name_len) != Some(name.as_bytes()) {
            return Err(error());
        }
        let data = local + 30 + name_len;
        if data > start || size > start - data {
            return Err(error());
        }
        let slice = &bytes[data..data + size];
        if crc32fast::hash(slice) != crc {
            return Err(error());
        }
        entries.insert(name, slice);
        local = data + size;
        at += 46 + name_len;
    }
    if at != end || local != start {
        return Err(error());
    }
    Ok(entries)
}
