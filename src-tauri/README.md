# Native application

APIO GRAPH uses Tauri 2 with a custom window header. The application identifier is
`app.apio.graph`. The installer registers `.aph` as an APIO GRAPH project;
the MIME value is a product identifier, not a claim of public registration.

## Build

Install the prerequisites in the [Tauri guide](https://v2.tauri.app/start/prerequisites/):
Rust 1.90 or newer (stable), Node.js and pnpm, plus Visual Studio C++ Build Tools and WebView2 on
Windows, or Xcode Command Line Tools on macOS. Dependency versions are pinned in
`Cargo.toml`, `Cargo.lock` and the frontend lockfile.

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm tauri dev
cargo test --manifest-path src-tauri/Cargo.toml --locked
pnpm tauri build
```

Build Windows installers on Windows and macOS bundles on macOS. `--bundles nsis`
selects a Windows installer, and `--bundles app,dmg` selects macOS output.
The macOS minimum is 13.3, aligning the webview with the frontend's modern
JavaScript features and Safari 16.4 compilation target.
Signing and notarization require the publisher's certificates and configuration.
Build products are ignored by Git. Platform compatibility must be verified on
each operating system before a release.

The Windows 1.0.0 NSIS configuration embeds Microsoft's offline WebView2 installer,
uses current-user installation and includes GPLv3 plus dependency license notices.
No development toolchain is required on end-user machines. The initial distribution
is unsigned; signing requires the publisher's certificate or signing service.

## Files and recovery

The frontend invokes a small set of application commands. Rust opens the native
dialog and reads the selected file in one operation; there is no arbitrary-path
read command or general frontend filesystem permission. Reads are limited to
regular files up to 200 MiB. The editor validates project schema and semantics
before replacing the current document.

Native OS drop events record the exact dropped paths before notifying the
frontend. The drop-read command consumes that permission once and rejects other
paths. Application errors use stable codes; operating-system details follow the
`FILE_IO` prefix for diagnostics and localized presentation.

Only project paths obtained from a native dialog, OS drop, launch argument, macOS open
event, or app recovery record are eligible for direct project saves. An ungranted
path opens Save As. A save writes a temporary file beside the destination,
flushes and synchronizes it, then uses `MoveFileExW` with replacement and write
through on Windows, or `rename` on macOS. No delete-first fallback is used.
Failure preserves the previous destination, and temporary files are removed.
The guarantee depends on the filesystem's atomic rename support; network shares
and abrupt hardware failure require platform testing.

The editor requests recovery every two minutes while modified, and on background
transitions. App data holds one atomically written `recovery.json` envelope with
the complete `.aph` text and original project path. A single record prevents
the document and path metadata from becoming inconsistent after a crash.
Recovery never writes the main project. The editor offers restore/discard at
startup and clears the record only on successful save or explicit discard.

Windows launch arguments and macOS `RunEvent::Opened` queue `.aph` files. The
frontend consumes `initial_file` at startup and after `apio://open-file`, using
its unsaved-document guard. Native dialogs, file association launch, close/save
choices, and crash recovery should be exercised manually on both platforms.

## Webview boundary

Capabilities grant only named document commands and window lifecycle events to
the local main window. Remote origins receive no capability. Production CSP
permits local assets, IPC, image blobs and inline styles; navigation outside the
application origin is rejected. Development adds the local Vite server and HMR.
No shell, remote HTTP, general filesystem, or JavaScript dialog permission is
enabled. The browser preview uses file input, downloads and localStorage recovery.
