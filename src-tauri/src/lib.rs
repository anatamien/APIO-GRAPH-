mod commands;
mod storage;

use commands::FileAccess;
use std::path::PathBuf;
use tauri::{Emitter, Manager};

pub fn run() {
    let access = FileAccess::default();
    if let Ok(mut pending) = access.pending.lock() {
        pending.extend(
            std::env::args_os()
                .skip(1)
                .map(PathBuf::from)
                .filter(|path| storage::project_path(path)),
        );
    }
    let app = tauri::Builder::default()
        .manage(access)
        .plugin(tauri_plugin_dialog::init())
        .on_window_event(|window, event| {
            if window.label() != "main" {
                return;
            }
            if let tauri::WindowEvent::DragDrop(tauri::DragDropEvent::Drop { paths, .. }) = event {
                let paths: Vec<PathBuf> = paths
                    .iter()
                    .filter_map(|path| path.canonicalize().ok())
                    .collect();
                let access = window.state::<FileAccess>();
                if let Ok(mut dropped) = access.dropped.lock() {
                    dropped.clear();
                    dropped.extend(paths.iter().cloned());
                }
                let _ = window.emit("apio://files-dropped", paths);
            }
        })
        .plugin(
            tauri::plugin::Builder::<tauri::Wry, ()>::new("local-navigation")
                .on_navigation(|_, url| {
                    let local_app = url.scheme() == "tauri"
                        || (url.scheme() == "http" && url.host_str() == Some("tauri.localhost"));
                    let local_dev = cfg!(debug_assertions)
                        && url.scheme() == "http"
                        && url.host_str() == Some("127.0.0.1")
                        && url.port() == Some(1420);
                    local_app || local_dev
                })
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            commands::open_file,
            commands::initial_file,
            commands::read_dropped_file,
            commands::begin_binary_transfer,
            commands::append_binary_transfer,
            commands::abort_binary_transfer,
            commands::save_project,
            commands::save_image,
            commands::write_recovery,
            commands::read_recovery,
            commands::clear_recovery,
        ])
        .build(tauri::generate_context!())
        .expect("Could not start APIO GRAPH");
    app.run(|app, event| {
        #[cfg(target_os = "macos")]
        if let tauri::RunEvent::Opened { urls } = event {
            let access = app.state::<FileAccess>();
            if let Ok(mut pending) = access.pending.lock() {
                pending.extend(
                    urls.into_iter()
                        .filter_map(|url| url.to_file_path().ok())
                        .filter(|path| storage::project_path(path)),
                );
            }
            let _ = app.emit("apio://open-file", ());
        }
        #[cfg(not(target_os = "macos"))]
        let _ = (app, event);
    });
}
