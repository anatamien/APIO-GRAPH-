# liborigin source provenance

Upstream: https://sourceforge.net/p/liborigin/git/ci/b636dba77ba709369db94f11ddf061f6d5a8410c/tree/
Version: 3.0.3, commit b636dba77ba709369db94f11ddf061f6d5a8410c.

The exact source subset used by APIO is included here, with original copyright
and SPDX notices. GPLv3 is selected wherever the source permits GPLv2 or GPLv3;
see COPYING. This is not an unmodified upstream build.

APIO changes:

- Check remaining bytes and delimiters before allocation; throw on truncation.
- Retain control bytes in passive text instead of clearing strings heuristically.
- Preserve source dataset IDs and byte provenance of graph curves, tree window IDs.
- Inventory attachment offsets, sizes and raw names; partial-tail warning is explicit.
- Reject zero cell sizes, bound project-tree recursion and checked binary field accesses.
- Open Windows paths through std::filesystem::u8path.
- Join late column metadata by source dataset ID; never fall back to a renamed
  or repeated display name when the ID cannot be resolved.

Unknown mask semantics and unknown object classes remain explicitly unsupported;
raw source ranges are retained. No scripts, formulas, COM objects or external
references are executed by this adapter. AppContainer and resource limits are
required in the product broker; liborigin is never a trusted input validator.

Build from the product directory:

    cmake -S src-tauri/native/origin -B build/origin -DBUILD_TESTING=ON
    cmake --build build/origin --config Release
    ctest --test-dir build/origin -C Release --output-on-failure

No user scientific fixture is included in these sources or tests.
