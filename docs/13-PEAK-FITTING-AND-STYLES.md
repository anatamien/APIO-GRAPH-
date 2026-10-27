# APIO GRAPH 1.3: peak fitting, uncertainties and scientific appearance

## Peak fitting

Open Mathematics and choose Peak fitting. Choose an existing raw or corrected series and an explicit X range. Every original observation in that range is used, in acquisition order; screen detail reduction is never numerical input. Repeated X observations remain separate, equally weighted observations.

Choose 1–8 Gaussian, Lorentzian or pseudo-Voigt components. Edit the center, actual height and positive full width at half maximum (FWHM). Pseudo-Voigt also has a mixing coefficient η. Parameter bounds are optional, fixed parameters remain fixed, and a constant or linear baseline can be included. The linear baseline is intercept + slope × (X − X₀), with an explicit reference X₀. Existing peak-detection results can supply seeds only after choosing that result and entering the peak numbers.

For u = (X − center)/FWHM, let G = exp(−4 ln(2) u²), L = 1/(1 + 4u²), cG = 2 sqrt(ln(2)/π), cL = 2/π and D = (1−η)cG + ηcL. The profile is height × ((1−η)cG G + ηcL L)/D. Thus η is the **Lorentzian integrated-area fraction**, height is the actual maximum and both kernels share the specified FWHM. Gaussian and Lorentzian are η = 0 and 1. Component area is height × FWHM/D, including its sign for negative peaks. This convention uses normalized kernels; it is not an unnormalized mixture of peak heights. [Normalized pseudo-Voigt background](https://docs.mantidproject.org/nightly/fitting/fitfunctions/PseudoVoigt.html) uses the complementary Gaussian-area coefficient.

The bounded, scaled nonlinear least-squares solver streams Givens QR rows and applies damping to a small parameter matrix. It never forms an N×N matrix or JᵀJ. Active constraints are solved in the remaining feasible variables. A small column-normalized Jacobi SVD detects rank loss; independently unidentifiable components are rejected. X/Y scaling, projected-gradient convergence, finite-number checks and iteration/time budgets are explicit. Cancel terminates the Worker. Stale responses cannot replace changed input data.

Independent reference tests compare parameters and residual SSE against [SciPy bounded trust-region least squares](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.least_squares.html), including overlap, mixed models, a constrained optimum, fixed parameters, negative peaks, small Y and large X. The generic optimizer is also checked from both starts against [NIST Gauss1 certified parameters and SSE](https://www.itl.nist.gov/div898/strd/nls/data/gauss1.shtml). NIST's exponential baseline belongs to the test benchmark; the product offers constant/linear baselines.

Preview is disposable and does not change the document. Apply adds the sum, individual components, residuals (observed Y minus modeled Y) and optional baseline as separate dependent datasets/series in one Undo action. Full outputs are evaluated on the original observations in the Worker. Their visibility/colors/styles are independent. Component and residual nodes depend on both the sum and the original data; recalculation reuses the fitted parent parameters instead of optimizing each component again. Parameter editing through a component opens its parent fit. Component removal is rejected if it would orphan downstream results or point anchors.

The report gives center, height, FWHM, analytical area, n, SSE, RMSE = sqrt(SSE/n), R² and an identifiability condition estimate. R² is undefined for a numerically constant signal. No parameter confidence intervals are estimated without a specified noise model. Nonconvergence, timeouts, invalid widths and singular fits are errors, not successful estimates.

## Measurement uncertainties

ΔX and ΔY are symmetric, absolute, finite, nonnegative values. Import may assign an error column to each XY mapping. The same source row supplies coordinates and errors; invalid, negative or missing selected errors are diagnosed. Zero is valid. Manual editing exposes ΔX/ΔY columns; clearing an error field leaves it missing. Sorting, copying and duplicating rows retain error values with stable point IDs. Origin worksheet-to-APIO mapping can explicitly assign error columns, matched by absolute source row; incomplete/invalid selected errors stop conversion.

Graph properties → Measurement uncertainties chooses none, per-point values or a constant for each axis. A series may override the dataset defaults independently of other series. Caps, line width, color and axis visibility are appearance settings. Missing per-point values are counted and never replaced with zero. Existing mathematical operations remain unweighted; merely adding ΔY does not introduce regression weights.

Dense screen intervals use the existing acquisition-order detail selection and batched SVG paths. Source errors and their endpoints remain available; F9 and automatic bounds include enabled error endpoints. Final exports draw **every original nonzero error interval**, in bounded path batches. Full point-mode exports above 50,000 markers batch every original marker as vector geometry; their `data-marker-count` attributes permit count verification without a separate DOM node per observation. Screen sampling never changes project arrays.

APH schema 1.3 adds optional point errors, per-dataset/per-series settings and fit metadata. Multi-tab workspaces use APIOPTS2 only for arrays containing errors: the 16-byte header is followed by 72-byte records (36-byte stable ID, X/Y binary64, 32-bit presence flags, ΔX/ΔY binary64). Missing values use explicit flags, not NaN sentinels. APIOPTS1 remains supported unchanged. New required capabilities make older readers reject unsupported content safely; APIO GRAPH 1.3 opens older 1.0/1.1/1.2 APH projects and existing workspaces.

## Scientific appearance

Graph properties → Scientific appearance offers Report, Article, Black and white and Presentation presets. A preview changes no stored content. Apply can target the graph or selected series. Individual colors are retained unless Apply preset colors is explicitly checked. Scientific measurements, IDs, axis titles/units, anchors, viewport, calculation parameters and hidden series remain unchanged. Courier New stays the scientific font.

Custom presets can capture current appearance, duplicate a preset, import/export a bounded `.apiostyle` JSON file and be saved locally (up to 20). Only whitelisted appearance fields are accepted; input cannot contain data, source paths, executable code or scientific ranges. The APH stores actual applied page, axis, series, legend, text and export appearance, not a dependency on a local preset. Applied colors are independent of the application theme.

Strict black-and-white export combines four dash patterns, six shapes and open/filled symbols to distinguish up to 48 curve styles. Line-only curves receive sparse identifying glyphs on actual source observations; these are export decorations, not fabricated scientific points. Point-mode exports preserve all markers. Working color documents are not mutated.

## Tables and document workflow

- A single click selects a table or edits a cell in place; dragging moves it. Double-click opens table properties. An overlapping properties panel temporarily hides during cell entry and returns afterward.
- Shift+click or Shift+drag selects a rectangular range; Ctrl+A selects the complete table. Selection on the canvas and properties grid is shared and visibly highlighted. Alignment displays Mixed for differing cells, so one Center choice updates the entire selection.
- Enter commits, another Enter opens the row below in the same column; Shift+Enter adds an internal line break; Tab advances; Esc cancels. Rich subscripts/superscripts, bold and italic use the existing text editor.
- Ctrl+C/V copies cells/ranges with rich content; selecting the table frame/move handle copies the whole table. Copies between tabs are independent and retain dimensions, merges, content, appearance and rotation. Properties → Send to tab sends an independent copy without removing the source. Origin read-only tabs cannot receive editable objects.
- Individual or selected rows/columns can be removed after confirmation when they contain text; one Undo restores them. Existing illustration-table bounds are 50 rows × 20 columns; all 1,000 cells can be selected/copied, independent of viewport virtualization.
- Outer edges, corners and internal dividers resize tables without scaling their font. Committed content grows affected columns/rows with symmetric padding. Table movement snaps to other table edges/centers and page centers; Alt bypasses snapping.
- Number format applies fixed/scientific precision and decimal-place controls to selected cells, including numeric value ± uncertainty. Original text is retained. Decimal-string arithmetic rounds ties away from zero without a binary64 conversion. Original text restores the initial display.
- Double-click a document tab or press F2 to rename its caption, Enter to accept, Esc to cancel. It does not rename disk files or datasets; the caption is saved in APH and supports Undo.
- Blank sheet creates a separate axis-free tab for existing objects and tables, with saving, export and Undo/Redo. Adding scientific data changes it into a graph.
- Axis-label editors can reuse the corresponding label from the previous graph tab. The existing Symbols palette inserts at the caret with visible symbol feedback; text tool shortcuts use physical key positions in RU/EN layouts while leaving text-field typing alone.
