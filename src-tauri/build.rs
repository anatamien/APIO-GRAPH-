fn main() {
    build_origin_helper();
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
        "workspace_chunk",
        "save_passive_bytes",
        "workspace_recovery",
        "save_image",
        "save_data_table",
        "write_recovery",
        "read_recovery",
        "clear_recovery",
        "origin_open",
        "origin_cancel",
        "origin_release",
        "origin_cells",
        "origin_resource",
        "origin_export_attachment",
        "origin_save",
        "origin_recovery_write",
        "origin_recovery_read",
        "origin_recovery_clear",
    ]);
    tauri_build::try_build(tauri_build::Attributes::new().app_manifest(manifest))
        .expect("Could not configure APIO GRAPH permissions");
}

fn build_origin_helper() {
    println!("cargo:rerun-if-env-changed=CMAKE");
    println!("cargo:rerun-if-changed=native/origin");
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() != Ok("windows") {
        return;
    }
    let out = std::path::PathBuf::from(std::env::var_os("OUT_DIR").unwrap()).join("origin-native");
    let fallback = std::path::PathBuf::from(
        r"C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin\cmake.exe",
    );
    let cmake = std::env::var_os("CMAKE")
        .map(std::path::PathBuf::from)
        .unwrap_or_else(|| {
            if fallback.exists() {
                fallback
            } else {
                "cmake".into()
            }
        });
    for args in [
        vec![
            "-S".into(),
            "native/origin".into(),
            "-B".into(),
            out.as_os_str().to_owned(),
            "-A".into(),
            "x64".into(),
        ],
        vec![
            "--build".into(),
            out.as_os_str().to_owned(),
            "--config".into(),
            "Release".into(),
            "--target".into(),
            "apio-origin-helper".into(),
        ],
    ] {
        let result = std::process::Command::new(&cmake)
            .args(args)
            .output()
            .expect("CMake is required to build the isolated Origin helper");
        assert!(
            result.status.success(),
            "Origin helper build failed: {}\n{}",
            String::from_utf8_lossy(&result.stdout),
            String::from_utf8_lossy(&result.stderr)
        );
    }
    println!(
        "cargo:rustc-env=APIO_ORIGIN_HELPER_PATH={}",
        out.join("Release/apio-origin-helper.exe").display()
    );
}
