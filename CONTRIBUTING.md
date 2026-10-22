# Contributing

Bug reports and focused pull requests are welcome. Follow the build and verification instructions in [README](README.md).

For a bug report, include the application version, Windows version, display scaling, steps to reproduce, and expected/actual behaviour. Use synthetic or anonymised data. Do not upload private research data, credentials or local diagnostic archives.

Keep numerical data, stable IDs and `.aph` compatibility intact. Screen-only optimisations must not reduce calculations or exports. Verify affected workflows in English/Russian and light/dark themes. Add meaningful regression coverage for behavioural changes and explain platform limitations accurately.

Commit source, tests, product documentation and build configuration. Exclude dependencies, build output, local assistant/editor configuration, temporary recordings, user projects and credentials. Run `pnpm check:repository` before proposing changes.

Contributions are accepted under GPL-3.0-only. Third-party code must retain its original notices and be compatible with the distribution.
