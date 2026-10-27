use super::{
    archive,
    broker::{OriginStore, Session},
    document::MAX_SOURCE,
};
use crate::storage;
use serde_json::{json, Value};
use std::{
    fs,
    path::{Path, PathBuf},
};
use tauri::{AppHandle, Manager, State, WebviewWindow};
fn file(directory: &Path) -> PathBuf {
    directory.join("origin-workspace.aph")
}
fn check(snapshot: &Value) -> Result<&Vec<Value>, String> {
    let tabs = snapshot["tabs"].as_array().ok_or("RECOVERY_INVALID")?;
    let index = snapshot["activeIndex"].as_u64().ok_or("RECOVERY_INVALID")?;
    if tabs.is_empty() || tabs.len() > 16 || index >= tabs.len() as u64 {
        return Err("RECOVERY_INVALID".into());
    }
    for t in tabs {
        if !t["dirty"].is_boolean()
            || !t["readOnly"].is_boolean()
            || (!t["path"].is_null() && !t["path"].is_string())
        {
            return Err("RECOVERY_INVALID".into());
        }
    }
    Ok(tabs)
}
pub(super) fn write_at(
    directory: &Path,
    store: &OriginStore,
    snapshot: &Value,
) -> Result<(), String> {
    let tabs = check(snapshot)?;
    let mut entries = vec![];
    let mut manifest = snapshot.clone();
    for (i, t) in tabs.iter().enumerate() {
        let bytes = if let Some(id) = t["sessionId"].as_str() {
            let session = store.get(id)?;
            let mut view = t["view"].clone();
            view["includeSource"] = json!(session.model["sourceResourceId"].is_string());
            archive::encode(&session, &view)?
        } else {
            let text = t["graphText"].as_str().ok_or("RECOVERY_INVALID")?;
            storage::validate_project_text(text)?;
            text.as_bytes().to_vec()
        };
        let name = format!("tabs/{i}.aph");
        manifest["tabs"][i]
            .as_object_mut()
            .ok_or("RECOVERY_INVALID")?
            .remove("graphText");
        manifest["tabs"][i]
            .as_object_mut()
            .ok_or("RECOVERY_INVALID")?
            .remove("sessionId");
        manifest["tabs"][i]["origin"] = json!(t["sessionId"].is_string());
        manifest["tabs"][i]["entry"] = json!(name);
        entries.push((name, bytes));
    }
    manifest["format"] = json!("APIO_WORKSPACE_RECOVERY");
    manifest["version"] = json!(1);
    entries.push((
        "recovery.json".into(),
        serde_json::to_vec(&manifest).map_err(storage::file_error)?,
    ));
    let bytes = archive::write_zip(&entries)?;
    fs::create_dir_all(directory).map_err(storage::file_error)?;
    storage::atomic_write(&file(directory), &bytes).map_err(storage::file_error)?;
    Ok(())
}
fn read_at(directory: &Path, store: &OriginStore) -> Result<Option<Value>, String> {
    if !file(directory).exists() {
        return Ok(None);
    }
    let bytes =
        storage::bounded_read(&file(directory), MAX_SOURCE as u64).map_err(storage::file_error)?;
    let mut entries = archive::read_zip(&bytes)?;
    let metadata = entries.remove("recovery.json").ok_or("RECOVERY_INVALID")?;
    if metadata.len() > 16 * 1024 * 1024 {
        return Err("RECOVERY_INVALID".into());
    }
    let mut snapshot: Value = serde_json::from_slice(&metadata).map_err(|_| "RECOVERY_INVALID")?;
    if snapshot["format"] != "APIO_WORKSPACE_RECOVERY" || snapshot["version"] != 1 {
        return Err("RECOVERY_INVALID".into());
    }
    let tabs = check(&snapshot)?;
    let mut decoded: Vec<Option<(Session, Value)>> = vec![];
    let mut graph_texts = std::collections::VecDeque::new();
    for t in tabs {
        let name = t["entry"].as_str().ok_or("RECOVERY_INVALID")?;
        let bytes = entries.remove(name).ok_or("RECOVERY_INVALID")?;
        if t["origin"] == true {
            let (session, _) = archive::decode(&bytes)?;
            archive::validate_view(&t["view"], &session.model)?;
            decoded.push(Some((session, t["view"].clone())))
        } else {
            let text = String::from_utf8(bytes).map_err(|_| "RECOVERY_INVALID")?;
            storage::validate_project_text(&text)?;
            graph_texts.push_back(text);
            decoded.push(None);
        }
    }
    if !entries.is_empty() {
        return Err("RECOVERY_INVALID".into());
    }
    let mut retained = vec![];
    let result = (|| {
        for (i, d) in decoded.into_iter().enumerate() {
            if let Some((session, view)) = d {
                let mut document = store.retain(session)?;
                document.view = Some(view);
                retained.push(document.session_id.clone());
                snapshot["tabs"][i]["origin"] =
                    serde_json::to_value(document).map_err(storage::file_error)?;
            } else {
                let text = graph_texts.pop_front().ok_or("RECOVERY_INVALID")?;
                snapshot["tabs"][i]["graphText"] = json!(text);
                snapshot["tabs"][i]
                    .as_object_mut()
                    .unwrap()
                    .remove("origin");
            }
        }
        Ok(Some(snapshot))
    })();
    if result.is_err() {
        for id in retained {
            let _ = store.release(&id);
        }
    }
    result
}
fn main(window: &WebviewWindow) -> Result<(), String> {
    if window.label() == "main" {
        Ok(())
    } else {
        Err("WINDOW_NOT_ALLOWED".into())
    }
}
#[tauri::command]
pub async fn origin_recovery_write(
    app: AppHandle,
    window: WebviewWindow,
    snapshot: Value,
) -> Result<(), String> {
    main(&window)?;
    let directory = app.path().app_data_dir().map_err(storage::file_error)?;
    tauri::async_runtime::spawn_blocking(move || {
        write_at(&directory, &app.state::<OriginStore>(), &snapshot)
    })
    .await
    .map_err(|_| "ORIGIN_TASK_FAILED")?
}
#[tauri::command]
pub async fn origin_recovery_read(
    app: AppHandle,
    window: WebviewWindow,
) -> Result<Option<Value>, String> {
    main(&window)?;
    let directory = app.path().app_data_dir().map_err(storage::file_error)?;
    tauri::async_runtime::spawn_blocking(move || read_at(&directory, &app.state::<OriginStore>()))
        .await
        .map_err(|_| "ORIGIN_TASK_FAILED")?
}
#[tauri::command]
pub fn origin_recovery_clear(
    app: AppHandle,
    window: WebviewWindow,
    _store: State<'_, OriginStore>,
) -> Result<(), String> {
    main(&window)?;
    let directory = app.path().app_data_dir().map_err(storage::file_error)?;
    match fs::remove_file(file(&directory)) {
        Ok(()) => Ok(()),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(e) => Err(storage::file_error(e)),
    }
}

#[cfg(test)]
mod tests {
    use super::super::{broker::session_from_bytes, document};
    use super::*;
    use std::collections::BTreeMap;
    #[test]
    fn mixed_recovery_restores_all_tabs_after_source_and_session_are_gone() {
        let directory = tempfile::tempdir().unwrap();
        let store = OriginStore::default();
        let source = b"own".to_vec();
        let doc = store
            .retain(
                session_from_bytes(
                    document::archive_only("own.opj", &source),
                    BTreeMap::from([("original".into(), source)]),
                )
                .unwrap(),
            )
            .unwrap();
        let graph = include_str!("../../../examples/example.aph");
        let snapshot = json!({"activeIndex":1,"tabs":[{"path":null,"dirty":true,"readOnly":false,"graphText":graph},{"path":null,"dirty":true,"readOnly":false,"sessionId":doc.session_id,"view":{"encoding":"windows-1251","selectedId":"source","includedIds":["source"],"includeSource":true}}]});
        write_at(directory.path(), &store, &snapshot).unwrap();
        store.release(&doc.session_id).unwrap();
        let restored = read_at(directory.path(), &store).unwrap().unwrap();
        assert_eq!(restored["activeIndex"], 1);
        assert_eq!(restored["tabs"][0]["graphText"], graph);
        assert_eq!(
            restored["tabs"][1]["origin"]["model"]["source"]["name"],
            "own.opj"
        );
    }
}
