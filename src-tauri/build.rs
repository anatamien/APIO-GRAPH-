fn main() {
    // Refresh the native executable resources when the application icon changes.
    println!("cargo:rerun-if-changed=icons/icon.ico");
    println!("cargo:rerun-if-changed=icons/32x32.png");
    println!("cargo:rerun-if-changed=icons/icon.png");
    let manifest = tauri_build::AppManifest::new().commands(&[
        "open_file",
        "initial_file",
        "read_dropped_file",
        "begin_binary_transfer",
        "append_binary_transfer",
        "abort_binary_transfer",
        "save_project",
        "save_image",
        "write_recovery",
        "read_recovery",
        "clear_recovery",
    ]);
    tauri_build::try_build(tauri_build::Attributes::new().app_manifest(manifest))
        .expect("Could not configure APIO GRAPH permissions");
}
