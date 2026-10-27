# Origin documents: experimental viewing and transfer

This development branch provides autonomous structural import on Windows x64,
typed tables, a searchable project tree and partial reconstruction of supported
2D graph pages. The published installer is unchanged. Import does not require
Origin. It is not an Origin replacement or a verified visual-equivalence engine.

## Reading and navigation

Open accepts OPJ/OPJU/ORG alongside APIO projects. The actual signature and
embedded version, rather than the extension, select a decoder. The current
legacy decoder has six tested build/version profiles:

| Header build | Embedded version | Observed coverage |
| --- | --- | --- |
| 2878 | 8.0724 | Workbook, folder, graph, matrix and note inventory |
| 3116 | 9.200272 | Line graph data and layer geometry |
| 3168 | 9.300226 | Three-layer scientific graph and linked worksheets |
| 3478 | 9.850212 | Folders and multiple graph pages |
| 3522 | 9.900225 | Multiple graph pages |
| 3551 | 9.950167 | Bar/column inventory and data; those plots are not rendered |

These profiles were exercised with 14 local inputs, including public LabPlot
test files. Coverage is per feature and sample, not a guarantee for every file
of the same generation. OPJU decoding, 3D, logarithmic axes, linked-axis
transformations and unimplemented plot codes remain unsupported. Unknown inputs
can be retained as original-only archives after an explicit choice.

The resizable/hideable tree shows folders, workbooks, sheets, pages, layers,
curves, matrices, notes and attachments. Search, filters and keyboard navigation
are view operations. Their local state does not modify scientific data or create
Undo entries. Typed, virtualized tables retain column roles, display order,
names, units and passive formulas. Missing, text, masked and non-finite cells
remain distinct. Range copy/TSV export uses source values without display
rounding. Matrix column/row pages use bounded resource reads.

## Graph pages and editable APIO copies

Supported linear 2D curves resolve actual X/Y relations and source ranges.
Page/layer frames, ranges and recognized styles are read from metadata; there
are no sample-specific graph layouts. Several regions remain one page. The
same scene implementation renders editable APIO pages and SVG/raster exports.
Unimplemented features have contextual limitations and retain their source
resources. A data fallback is labelled as such and does not claim original
appearance. Spline equivalence and full Origin typography are unverified.

Transfer creates an independent editable APIO tab, or appends to an explicitly
selected existing graph in one Undo operation. X/Y mapping is explicit; using a
row index as X requires selection and is labelled. The source Origin tab stays
intact. Source units, missing-row breaks and passive provenance are retained;
foreign calculated columns are imported results without native recalculation.
No formulas, scripts, attachments or external references execute on import.
Attachments are exported as passive bytes; preview is limited to verified
PNG/JPEG signatures.

Technical diagnostics and source embedding options are available from the
Origin commands menu. There is no permanent Compatibility column. A successful
object selection does not repeat decoder warnings. Approximate reconstruction
is never labelled as exact merely because it looks similar.

## Saving and recovery

Saving an Origin tab writes one self-contained .aph container with versioned
metadata and hashed binary resources. Existing APIO JSON .aph projects retain
their schema and reader path. Older APIO versions cannot read the Origin
container; its minimum reader is 1.4. Converted APIO pages use optional validated
extensions for regions, styling and provenance.

Include original Origin file starts enabled in advanced save options. Disabling
it omits the embedded original; decoded and opaque resources remain. Origin
documents reopen without an external source file. Save affects the selected
tab. Workspace recovery preserves APIO and Origin tabs together. Transfer and
editing never write back to OPJ/OPJU.

## Resource boundaries and building

Input and user archives are limited to 200 MiB. The decoder runs in an
AppContainer without network capabilities and a one-process Job (512 MiB
committed memory, 15 s user CPU, 30 s wall time). Rust validates IPC, resource
bounds, hashes and archive paths. Cancellation or a closed parent pipe
terminates the worker. There is no unsandboxed decoder fallback. Staging is
private; source-file and application-directory ACLs are not changed.

Large conversions and TSV formatting run in a cancellable Web Worker. Common
immutable column resources load once, and at most two page conversion results
are cached. Editable conversion is limited to one million source rows per
column and two million points per operation; full archived resources remain
available in the viewer.

Windows builds require CMake 3.20+ and MSVC. Set CMAKE if it is not discoverable.
Patched pinned liborigin sources/licenses are bundled under
src-tauri/native/origin/liborigin; Rust builds and embeds the helper. End users
need neither CMake nor liborigin separately. Browser previews and other operating
systems can retain originals and read supported .aph containers, but raw
structural decoding is not enabled there. macOS isolation/packaging and an
independent comparison in Origin itself still require verification.

No private scientific fixture is included in this repository or uploaded by
import. Public regression corpus provenance:
[KDE LabPlot Project tests](https://github.com/KDE/labplot/tree/master/tests/import_export/Project).

### Catalog and passive attachments

The default catalog shows meaningful folders, books, worksheets, matrices, graph
pages and layers. Redundant per-curve/per-label entries, raw nodes and unknown
attachments are available through Additional contents. This is a view filter:
no nodes, original ranges or bytes are removed from the model or common APH.
Known native attachment signatures (PNG, JPEG, GIF, BMP, PDF, ZIP) are labeled.
The viewer previews bounded raster images and passive UTF-8 text, never executes
attachments, and does not claim to decode PDF, OLE or arbitrary containers.
Unknown data stays available in technical view and can be saved as passive bytes.

X and Y assignments are explicit and independent of Origin's stored role.
Selecting the current X as a Y clears X and requires the user to choose another
X; no column is silently discarded or converted to row indices. Transferred
APIO pages keep editable labels and per-area axes with normal Undo/Redo.

Worksheet and matrix widths are measured from immutable numeric resources in
bounded worker blocks. Equal-width columns use the longest displayed numeric
representation; individual widths are optional. This does not round or rewrite
measurements. Column meaning hints use resolved curve references and layer-axis
labels. Ambiguous or absent references do not trigger guessed assignments.
