use serde::{Deserialize, Serialize};
use std::{
    fs::{self, File},
    io::{self, Read, Write},
    path::{Path, PathBuf},
};

pub const MAX_FILE_BYTES: u64 = 200 * 1024 * 1024;

pub fn file_error(error: impl std::fmt::Display) -> String {
    let detail = error.to_string();
    if detail.starts_with("FILE_") {
        detail
    } else {
        format!("FILE_IO:{detail}")
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub struct Recovery {
    pub text: String,
    pub path: Option<String>,
}

pub fn bounded_read(path: &Path, limit: u64) -> io::Result<Vec<u8>> {
    let file = File::open(path)?;
    if !file.metadata()?.is_file() {
        return Err(io::Error::new(
            io::ErrorKind::InvalidInput,
            "FILE_NOT_REGULAR",
        ));
    }
    if file.metadata()?.len() > limit {
        return Err(io::Error::new(io::ErrorKind::InvalidData, "FILE_TOO_LARGE"));
    }
    let mut bytes = Vec::new();
    file.take(limit + 1).read_to_end(&mut bytes)?;
    if bytes.len() as u64 > limit {
        return Err(io::Error::new(io::ErrorKind::InvalidData, "FILE_TOO_LARGE"));
    }
    Ok(bytes)
}

/// Write and sync in the destination directory before an atomic replacement.
/// The destination is never deleted as a preparatory step.
pub fn atomic_write(path: &Path, bytes: &[u8]) -> io::Result<()> {
    atomic_write_using(path, |file| file.write_all(bytes))
}

fn atomic_write_using(
    path: &Path,
    write: impl FnOnce(&mut File) -> io::Result<()>,
) -> io::Result<()> {
    let parent = path
        .parent()
        .filter(|p| !p.as_os_str().is_empty())
        .unwrap_or(Path::new("."));
    let mut temporary = tempfile::Builder::new()
        .prefix(".apio-save-")
        .tempfile_in(parent)?;
    if let Ok(metadata) = fs::metadata(path) {
        temporary
            .as_file()
            .set_permissions(metadata.permissions())?;
    }
    write(temporary.as_file_mut())?;
    temporary.as_file_mut().flush()?;
    temporary.as_file().sync_all()?;
    let temporary_path = temporary.into_temp_path();
    replace(&temporary_path, path)?;
    #[cfg(unix)]
    {
        // Some filesystems do not support directory syncing. The file itself was synced.
        let _ = File::open(parent).and_then(|dir| dir.sync_all());
    }
    Ok(())
}

#[cfg(windows)]
fn replace(source: &Path, destination: &Path) -> io::Result<()> {
    use std::os::windows::ffi::OsStrExt;
    use windows_sys::Win32::Storage::FileSystem::{
        MoveFileExW, MOVEFILE_REPLACE_EXISTING, MOVEFILE_WRITE_THROUGH,
    };
    let source: Vec<u16> = source.as_os_str().encode_wide().chain(Some(0)).collect();
    let destination: Vec<u16> = destination
        .as_os_str()
        .encode_wide()
        .chain(Some(0))
        .collect();
    // Both paths are on the same filesystem; COPY_ALLOWED is deliberately absent.
    let result = unsafe {
        MoveFileExW(
            source.as_ptr(),
            destination.as_ptr(),
            MOVEFILE_REPLACE_EXISTING | MOVEFILE_WRITE_THROUGH,
        )
    };
    if result == 0 {
        Err(io::Error::last_os_error())
    } else {
        Ok(())
    }
}

#[cfg(not(windows))]
fn replace(source: &Path, destination: &Path) -> io::Result<()> {
    fs::rename(source, destination)
}

pub fn project_path(path: &Path) -> bool {
    path.extension()
        .is_some_and(|ext| ext.eq_ignore_ascii_case("aph"))
}

/// Canonicalize both an existing file and a new filename inside an existing directory.
pub fn canonical_destination(path: &Path) -> io::Result<PathBuf> {
    if path.exists() {
        return path.canonicalize();
    }
    let parent = path
        .parent()
        .filter(|p| !p.as_os_str().is_empty())
        .unwrap_or(Path::new("."));
    let name = path
        .file_name()
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidInput, "FILE_NAME_REQUIRED"))?;
    Ok(parent.canonicalize()?.join(name))
}

pub fn validate_project_text(text: &str) -> Result<(), String> {
    if text.len() as u64 > MAX_FILE_BYTES {
        return Err("FILE_TOO_LARGE".into());
    }
    let value: serde_json::Value =
        serde_json::from_str(text).map_err(|e| format!("PROJECT_INVALID_JSON:{e}"))?;
    if value.get("format").and_then(|v| v.as_str()) != Some("APIO_GRAPH_PROJECT") {
        return Err("PROJECT_INVALID_FORMAT".into());
    }
    Ok(())
}

pub fn recovery_file(directory: &Path) -> PathBuf {
    directory.join("recovery.json")
}

pub fn write_recovery_at(directory: &Path, recovery: &Recovery) -> Result<(), String> {
    validate_project_text(&recovery.text)?;
    fs::create_dir_all(directory).map_err(file_error)?;
    let bytes = serde_json::to_vec(recovery).map_err(|e| format!("RECOVERY_INVALID:{e}"))?;
    atomic_write(&recovery_file(directory), &bytes).map_err(file_error)
}

pub fn read_recovery_at(directory: &Path) -> Result<Option<Recovery>, String> {
    let path = recovery_file(directory);
    if !path.exists() {
        return Ok(None);
    }
    // JSON escaping can expand a valid project string up to six times.
    let bytes = bounded_read(&path, MAX_FILE_BYTES * 6 + 64 * 1024).map_err(file_error)?;
    let recovery: Recovery =
        serde_json::from_slice(&bytes).map_err(|e| format!("RECOVERY_INVALID:{e}"))?;
    validate_project_text(&recovery.text)?;
    Ok(Some(recovery))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn replacement_and_creation_are_complete() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("project.aph");
        atomic_write(&path, b"original").unwrap();
        atomic_write(&path, b"replacement").unwrap();
        assert_eq!(fs::read(&path).unwrap(), b"replacement");
        assert_eq!(fs::read_dir(dir.path()).unwrap().count(), 1);
    }

    #[test]
    fn failed_write_leaves_original_and_removes_temporary_file() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("project.aph");
        fs::write(&path, b"readable original").unwrap();
        let error = atomic_write_using(&path, |file| {
            file.write_all(b"incomplete replacement")?;
            Err(io::Error::new(
                io::ErrorKind::StorageFull,
                "simulated disk full",
            ))
        });
        assert!(error.is_err());
        assert_eq!(fs::read(&path).unwrap(), b"readable original");
        assert_eq!(fs::read_dir(dir.path()).unwrap().count(), 1);
    }

    #[test]
    fn replacement_failure_does_not_delete_destination() {
        let dir = tempfile::tempdir().unwrap();
        let destination = dir.path().join("directory.aph");
        fs::create_dir(&destination).unwrap();
        fs::write(destination.join("keep"), b"original").unwrap();
        assert!(atomic_write(&destination, b"replacement").is_err());
        assert_eq!(fs::read(destination.join("keep")).unwrap(), b"original");
    }

    #[cfg(windows)]
    #[test]
    fn locked_project_survives_a_failed_windows_replacement() {
        use std::os::windows::fs::OpenOptionsExt;
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("project.aph");
        let original = include_bytes!("../../examples/example.aph");
        fs::write(&path, original).unwrap();
        let lock = fs::OpenOptions::new()
            .read(true)
            .share_mode(0)
            .open(&path)
            .unwrap();
        assert!(atomic_write(&path, b"replacement").is_err());
        drop(lock);
        assert_eq!(fs::read(&path).unwrap(), original);
        assert_eq!(fs::read_dir(dir.path()).unwrap().count(), 1);
    }

    #[test]
    fn recovery_round_trip_keeps_complete_project_and_original_path() {
        let dir = tempfile::tempdir().unwrap();
        let recovery = Recovery {
            text: include_str!("../../examples/example.aph").to_string(),
            path: Some("C:/experiments/Опыт.aph".into()),
        };
        write_recovery_at(dir.path(), &recovery).unwrap();
        assert_eq!(read_recovery_at(dir.path()).unwrap(), Some(recovery));
    }

    #[test]
    fn read_is_bounded_and_rejects_directories() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("large.csv");
        fs::write(&path, b"123456").unwrap();
        assert!(bounded_read(&path, 5).is_err());
        assert!(bounded_read(dir.path(), 10).is_err());
        assert_eq!(bounded_read(&path, 6).unwrap(), b"123456");
    }
}
