# Changelog

## 1.2.0 — 2026-10-27

Data, analysis and portable workspaces. Includes the earlier 1.1 data/results milestone.

- Multi-tab APH workspaces retain exact point IDs and IEEE-754 values, current APIO edits and original/passive Origin resources. Cancellable worker validation covers inactive tabs before replacement; saves retain concurrent edits and Undo/Redo.
- Diagram tables with rich text, merges, source-value snapshots, thin default lines, direct grid creation and independent row/column drag. Vector and raster export share the same layout.
- Scientific symbol palette, safe last-applied tool parameters and searchable 1–100-tab navigation.
- Experimental isolated Origin structural viewer and supported 2D XY page transfer. Compact column widths scan full immutable numeric buffers in bounded worker blocks; actual curve references supply column-meaning hints.
- Fixed transferred-page label editing/Cancel hit testing, Origin startup recovery cleanup, header tab controls and unnecessary table repaint during pan.
- Separate APH document icon; Windows x64 offline installer with bundled WebView2. Origin support is partial, not a complete implementation of roadmap 1.4.

### Signal processing

- Manual, selected-background polynomial and true banded AsLS baseline correction, with independent baseline/corrected result curves and chart-editable nodes.
- Maxima/minima detection with prominence, physical/sample distance, interpolated half-prominence widths, incomplete-edge diagnostics and a virtual result table with full-precision CSV/TSV export.
- Signed region integration with movable X boundaries, zero/reference baseline, union-grid interpolation, independent fill/label settings and dependency recalculation.
- Cancellable numerical Worker packets, generation/input guards, shared paired-baseline solves and cached immutable peak tables; no numerical calculation during navigation or appearance edits.
- `.aph` schema 1.1.0 with strict structured scientific results and metadata-only migration of existing 1.0 projects. Original schema remains supported.
- Confirmed scientific overlays in SVG/PNG/JPEG and strict B/W export; native CSV/TSV save dialog. See [numerical methods and limitations](docs/10-SIGNAL-ANALYSIS.md).

### Data and results (1.1 milestone, included in 1.2.0)

- A temporary, searchable and virtualized dependency tree for source datasets, processing operations, derived curves and scalar results.
- Direct access to curve properties, tables, independent visibility, renaming and calculation sources; annotations remain a separate section.
- Editing existing processing parameters with preview/cancel and one Undo command. Recalculation retains IDs, individual styles and the viewport.
- Indexed dependency invalidation, topological branch recalculation, cascade deletion with linked-object confirmation and stale-response protection.
- Transferable numeric Worker packets and per-job numerical result reuse; no full-document copy for recalculation. Curve geometry is cached independently; dense collections reuse batched SVG markers.
- Existing `.aph` schema 1.0.0 remains unchanged. Result labels and source units use its existing extensible calculation parameters. Old projects retain their data and styling.

## 1.0.0 — 2026-10-22

First accepted Windows release.

- TXT/CSV/TSV import, table paste and manual entry; independent tabs with explicit append.
- Editable axes, series, markers and legend; text, subscript/superscript, lines, arrows, callouts and regions.
- Numerical analysis, derived-result styling, recalculation and independent visibility.
- Stable dense-point display and batched SVG screen markers; original measurements and export precision retained.
- Virtual data table, direct series properties and safe partial-entry drafts.
- Complete `.aph` projects, per-graph undo/redo and local recovery.
- SVG/PNG/JPEG export with DPI, dimensions and original/greyscale/black-and-white colours.
- English/Russian; light, True Black and system themes; wheel zoom, F9 and pinnable tools with visible active state.
- Windows x64 offline NSIS installer including WebView2, `.aph` association and AG icons.
- GPL-3.0-only source release with third-party notices.

The initial Windows installer is unsigned. A currently verified signed/notarized macOS release is not included. Performance measurements do not establish 244 FPS presentation on every display or GPU.
