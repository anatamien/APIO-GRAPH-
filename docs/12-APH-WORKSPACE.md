# APH workspace container — format 1

The workspace reader/writer, worker boundary, native atomic I/O and diagram-table
schema are implemented. This document describes the storage contract. The
container version is independent of the application's roadmap version; it does
not imply complete Origin editing or visual equivalence.

## User contract

Save and Ctrl/Cmd+S save all open graphs into one portable file whenever several
tabs, any Origin document, or an existing workspace container are present.
Save As selects a new common path once. The common path remains the target when
only one tab remains. Saving a current graph separately is an explicit command.
Source TXT/CSV/OPJ and separately opened APH paths are not implicit save targets.

Opening a legacy JSON APH adds one graph as before. Opening a workspace offers
replacement with unsaved-document protection, or an explicit append operation.
No existing state is replaced before the complete incoming container validates.
Append assigns fresh tab namespaces where needed; graph-internal IDs and point
values remain unchanged. Source paths are not required to reopen a workspace.

Each tab keeps its own History. Save captures an immutable set of graph/view
references, tab order and active selection at its start. Successful completion
acknowledges exactly those history revisions and that structural revision;
concurrent edits, new/closed tabs and Undo are never acknowledged as saved by
an older snapshot. Save does not reset Undo/Redo. Historical Undo snapshots are
not part of the portable format, matching standalone APH behavior.

## Physical representation

Use a strict stored-only ZIP envelope with `manifest.json` and hash-addressed
resources. No Base64, path extraction, compression or executable attachments.
The first implementation deliberately accepts ZIP method 0 only. A future
compressed variant requires a new tested reader capability and bounded
decompression; it must not silently broaden the existing Origin archive reader.

A paired local Node 24.14.0 probe with one million synthetic points measured
80,519,741 bytes / 869.75 ms for legacy JSON serialization, plus 481.24 ms for
its stored ZIP envelope. Binary-point workspaces used 52,002,786 bytes and
918.01 ms to write, 810.60 ms to read and fully validate. Raw point-buffer
encoding/decoding took 135.07/207.34 ms. Deflate used 15,666,348 bytes but added
830.03 ms after JSON serialization, so compression is not enabled. These are
single paired codec probes on one machine, not GUI latency or peak-memory
claims. End-to-end browser/native results belong in the corresponding local QA
report, which is excluded from the repository.

The manifest identifies `APIO_GRAPH_WORKSPACE`, format version 1, required reader
capabilities, a workspace UUID, ordered tab UUIDs, active tab, document kinds,
portable labels, resource hashes and byte lengths. It contains no device paths,
tokens, local preferences, temporary cursors or modal state. Recovery may use a
distinct envelope carrying device-specific recovery metadata; that metadata is
never copied into a user save.

Graph resources contain the existing project metadata with point-resource
references instead of inline measurement arrays. Each dataset references one
immutable point buffer. IDs are scoped to their tab/document, not a global
project-name lookup. Point buffers retain acquisition order, exact UUID strings,
IEEE-754 binary64 X/Y values and the sign of zero. There is no display reduction
in storage. Calculations, objects, styles, axes, units, provenance and validated
optional plot-area extensions retain their existing document meaning.

Origin resources contain the complete validated model, view/selection and a
mapping from local resource IDs to container resources. Original OPJ/OPJU bytes
are retained once per verified content hash. Recognized data, passive formulas,
notes, matrices, opaque fragments and attachments are retained even when not
visible. APIO edits are stored as their current graph documents, not reconstructed
by reimporting Origin. Unknown rendering remains unknown; byte retention does
not confer editing or visual-equivalence support.

No decoder or script executes when reopening APH. Original Origin extraction is
an explicit passive-byte operation. Any future reimport is explicit and creates
a separate revision/copy with conflict handling; it never overwrites saved edits.

## Validation and resource limits

- Container maximum: 512 MiB; at most 100 meaningful outer tabs.
- Individual resource maximum: 200 MiB; manifest maximum: 16 MiB; bounded entry
  count and metadata complexity. Existing raw OPJ and standalone JSON limits
  remain 200 MiB. A dataset retains the existing one-million-point schema limit.
- Strict directory/local-header agreement, CRC, declared lengths, exact paths,
  unique entries and SHA-256 checks. Reject traversal, symlinks, encryption,
  compression, trailing records, unknown required versions and unlisted bytes.
- Validate every document schema, data buffer, ID/reference and calculation
  relationship before applying the workspace. Validate Origin resources with
  the existing Origin model/resource rules. Reject cycles and mixed namespaces.
- A corrupt tab does not produce a silent partial success. The current workspace
  remains intact and the source file remains unchanged.

Validation and preparation run in a cancellable worker. Validation may hydrate
one graph temporarily to reuse scientific semantic checks; it does not mount
inactive canvases or publish partial documents to React. Verified inactive
documents keep immutable resource references and metadata, materializing data
on selection. Validation retains the active graph until its first hydration so
opening it does not decode/validate the same point array twice; that worker
reference is released after delivery. An unloaded graph must never masquerade as an empty scientific
document. Repeated page selection does not decode OPJ again.

Native I/O reads/writes bounded chunks through exact user-granted paths. Saving
uses background serialization and atomic replacement. A failed/canceled write
retains the previous file and recovery snapshot. Unchanged point arrays reuse
their encoded resources; shared Origin columns and originals are not copied per
layer. Limits are exercised with 10/30/100 tabs and a million points. Process-memory
snapshots are distinguished from absolute peak memory in measurement reports.

## Compatibility and rollout

Readers continue accepting standalone `APIO_GRAPH_PROJECT` 1.0/1.1 and existing
`APIO_ORIGIN_CONTAINER` 1. New workspace manifests declare required graph schema
capabilities, including the subsequent diagram-table schema. An unknown required
capability produces a newer-reader message, not a lossy downgrade. Already
released executables cannot be retroactively changed; their legacy error
handling is recorded separately in compatibility checks.

Diagram tables use the optional `table` object in project schema 1.2.0. Older
1.0/1.1 documents keep their schema until such an object is created. A workspace
containing a table advertises `graph-1.2`, including when its graph is still lazy.
Table text is passive rich text, never HTML or a formula. Row/column IDs, merges,
cell styles and page/data anchors round-trip with the object; measurements and
calculation relationships remain separate. The maximum is 50 rows by 20 columns.

Old executables cannot read the new workspace envelope or table schema. Use
"Save current graph separately" for a standalone current-schema JSON APH; a
project containing tables still needs a reader supporting schema 1.2. No
automatic downgrade drops unsupported objects. The reader continues accepting
legacy APH and Origin containers, including a previously disabled Origin-source
preference; a missing original in an old file cannot be reconstructed. Common
workspace saves always retain every available original and passive resource.

The separate project icon is registered by the installer-owned file type, never
by overriding Windows UserChoice. Main application branding stays unchanged.
macOS document-icon integration needs a native macOS packaging check; Windows
configuration alone is not evidence that Finder displays it correctly.
