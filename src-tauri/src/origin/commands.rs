use super::{
    archive,
    broker::{OriginDocumentRef, OriginStore},
};
use crate::{commands::FileAccess, storage};
use serde_json::{json, Value};
use std::{
    io::{Read, Seek, SeekFrom},
    path::Path,
};
use tauri::{AppHandle, Manager, State, WebviewWindow};
use tauri_plugin_dialog::DialogExt;
fn main_window(window: &WebviewWindow) -> Result<(), String> {
    if window.label() != "main" {
        Err("WINDOW_NOT_ALLOWED".into())
    } else {
        Ok(())
    }
}
#[tauri::command]
pub async fn origin_open(
    app: AppHandle,
    window: WebviewWindow,
    access: State<'_, FileAccess>,
    path: String,
    request_id: String,
    archive_only: Option<bool>,
) -> Result<OriginDocumentRef, String> {
    main_window(&window)?;
    let path = access.origin_granted(Path::new(&path))?;
    tauri::async_runtime::spawn_blocking(move || {
        if archive_only.unwrap_or(false) {
            app.state::<OriginStore>().open_archive(&path, &request_id)
        } else {
            app.state::<OriginStore>().open(&path, &request_id)
        }
    })
    .await
    .map_err(|_| "ORIGIN_TASK_FAILED")?
}
#[tauri::command]
pub fn origin_cancel(
    window: WebviewWindow,
    store: State<'_, OriginStore>,
    request_id: String,
) -> Result<(), String> {
    main_window(&window)?;
    store.cancel(&request_id)
}
#[tauri::command]
pub fn origin_release(
    window: WebviewWindow,
    store: State<'_, OriginStore>,
    session_id: String,
) -> Result<(), String> {
    main_window(&window)?;
    store.release(&session_id)
}
fn part(path: &Path, offset: u64, length: usize) -> Result<Vec<u8>, String> {
    let mut f = std::fs::File::open(path).map_err(storage::file_error)?;
    let size = f.metadata().map_err(storage::file_error)?.len();
    if offset > size || length as u64 > size - offset || length > 1024 * 1024 {
        return Err("ORIGIN_INVALID_RESOURCE".into());
    }
    f.seek(SeekFrom::Start(offset))
        .map_err(storage::file_error)?;
    let mut b = vec![0; length];
    f.read_exact(&mut b).map_err(storage::file_error)?;
    Ok(b)
}
/// Bounded, binary-only IPC. Resource paths are resolved inside an owned session.
#[tauri::command]
pub fn origin_resource(
    window: WebviewWindow,
    store: State<'_, OriginStore>,
    session_id: String,
    resource_id: String,
    offset: u64,
    count: usize,
) -> Result<tauri::ipc::Response, String> {
    main_window(&window)?;
    let session = store.get(&session_id)?;
    let path = session
        .resources
        .get(&resource_id)
        .ok_or("ORIGIN_INVALID_RESOURCE")?;
    Ok(tauri::ipc::Response::new(part(path, offset, count)?))
}
#[tauri::command]
pub async fn origin_export_attachment(
    app: AppHandle,
    window: WebviewWindow,
    store: State<'_, OriginStore>,
    session_id: String,
    node_id: String,
) -> Result<Option<String>, String> {
    main_window(&window)?;
    let session = store.get(&session_id)?;
    let node = session.model["nodes"]
        .as_array()
        .and_then(|nodes| {
            nodes
                .iter()
                .find(|n| n["id"] == node_id && n["kind"] == "attachment")
        })
        .ok_or("ORIGIN_ATTACHMENT_MISSING")?;
    let resource = node["properties"]["resourceId"]
        .as_str()
        .ok_or("ORIGIN_INVALID_RESOURCE")?;
    let source = session
        .resources
        .get(resource)
        .ok_or("ORIGIN_INVALID_RESOURCE")?
        .clone();
    let destination = app
        .dialog()
        .file()
        .set_parent(&window)
        .add_filter("Passive attachment bytes", &["bin"])
        .set_file_name("Origin-attachment.bin")
        .blocking_save_file();
    let Some(destination) = destination else {
        return Ok(None);
    };
    let destination = destination.into_path().map_err(storage::file_error)?;
    if destination
        .extension()
        .and_then(|s| s.to_str())
        .map(str::to_ascii_lowercase)
        .as_deref()
        != Some("bin")
    {
        return Err("ORIGIN_ATTACHMENT_EXTENSION".into());
    }
    let destination = storage::canonical_destination(&destination).map_err(storage::file_error)?;
    let target = destination.clone();
    tauri::async_runtime::spawn_blocking(move || {
        let bytes = std::fs::read(source).map_err(storage::file_error)?;
        storage::atomic_write(&target, &bytes).map_err(storage::file_error)
    })
    .await
    .map_err(|_| "ORIGIN_TASK_FAILED")??;
    Ok(Some(destination.to_string_lossy().into()))
}
pub(super) fn cells(
    session: &super::broker::Session,
    node_id: &str,
    start: u64,
    count: u64,
) -> Result<Value, String> {
    if count > 250 {
        return Err("ORIGIN_INVALID_RANGE".into());
    }
    let column = session.model["columns"]
        .as_array()
        .and_then(|a| a.iter().find(|c| c["nodeId"] == node_id))
        .ok_or("ORIGIN_COLUMN_MISSING")?;
    let rows = column["rowCount"].as_u64().ok_or("ORIGIN_INVALID_MODEL")?;
    if start > rows || count > rows - start {
        return Err("ORIGIN_INVALID_RANGE".into());
    }
    let path = |key: &str| {
        session
            .resources
            .get(column[key].as_str().unwrap_or(""))
            .ok_or("ORIGIN_INVALID_RESOURCE".to_string())
    };
    let values = part(path("values")?, start * 8, (count * 8) as usize)?;
    let tags = part(path("tags")?, start, count as usize)?;
    let offsets = if column["textOffsets"].is_string() {
        Some(part(
            path("textOffsets")?,
            start * 4,
            ((count + 1) * 4) as usize,
        )?)
    } else {
        None
    };
    let mut result = vec![];
    for i in 0..count as usize {
        let bits = u64::from_le_bytes(values[i * 8..i * 8 + 8].try_into().unwrap());
        let value = f64::from_bits(bits);
        let tag = tags[i] & 127;
        let mut cell = json!({"kind":"unknown","value":null,"bits":format!("{bits:016x}"),"masked":tags[i]&128!=0});
        match tag {
            0 => {
                cell["kind"] = json!(if value.is_finite() {
                    "number"
                } else {
                    "special"
                });
                if value.is_finite() {
                    cell["value"] = json!(value)
                }
            }
            1 => cell["kind"] = json!("missing"),
            2 => {
                let o = offsets.as_ref().ok_or("ORIGIN_INVALID_RESOURCE")?;
                let a = u32::from_le_bytes(o[i * 4..i * 4 + 4].try_into().unwrap()) as u64;
                let b = u32::from_le_bytes(o[i * 4 + 4..i * 4 + 8].try_into().unwrap()) as u64;
                if b < a || b - a > 65536 {
                    return Err("ORIGIN_INVALID_RESOURCE".into());
                }
                cell["kind"] = json!("text");
                cell["bytesHex"] = json!(super::document::hex(&part(
                    path("textBytes")?,
                    a,
                    (b - a) as usize
                )?));
            }
            3 => {}
            _ => return Err("ORIGIN_INVALID_RESOURCE".into()),
        }
        result.push(cell);
    }
    Ok(json!(result))
}
#[tauri::command]
pub fn origin_cells(
    window: WebviewWindow,
    store: State<'_, OriginStore>,
    session_id: String,
    node_id: String,
    start: u64,
    count: u64,
) -> Result<Value, String> {
    main_window(&window)?;
    let session = store.get(&session_id)?;
    cells(&session, &node_id, start, count)
}
#[tauri::command]
#[allow(clippy::too_many_arguments)] // Tauri injects four native context arguments.
pub async fn origin_save(
    app: AppHandle,
    window: WebviewWindow,
    access: State<'_, FileAccess>,
    store: State<'_, OriginStore>,
    session_id: String,
    view: Value,
    path: Option<String>,
    save_as: bool,
) -> Result<Option<String>, String> {
    main_window(&window)?;
    let session = store.get(&session_id)?;
    archive::validate_view(&view, &session.model)?;
    let destination = path
        .as_deref()
        .and_then(|p| access.granted(Path::new(p)).ok())
        .filter(|p| !save_as && storage::project_path(p));
    let destination = if let Some(p) = destination {
        p
    } else {
        let suggested = path
            .as_deref()
            .and_then(|p| Path::new(p).file_name())
            .and_then(|p| p.to_str())
            .unwrap_or("Origin.aph");
        let selected = app
            .dialog()
            .file()
            .set_parent(&window)
            .add_filter("APIO GRAPH Origin document", &["aph"])
            .set_file_name(suggested)
            .blocking_save_file();
        let Some(selected) = selected else {
            return Ok(None);
        };
        let p = selected.into_path().map_err(storage::file_error)?;
        if !storage::project_path(&p) {
            return Err("PROJECT_EXTENSION_REQUIRED".into());
        }
        storage::canonical_destination(&p).map_err(storage::file_error)?
    };
    let target = destination.clone();
    tauri::async_runtime::spawn_blocking(move || {
        let bytes = archive::encode(&session, &view)?;
        storage::atomic_write(&target, &bytes).map_err(storage::file_error)
    })
    .await
    .map_err(|_| "ORIGIN_TASK_FAILED")??;
    access.grant(&destination)?;
    Ok(Some(destination.to_string_lossy().into()))
}
