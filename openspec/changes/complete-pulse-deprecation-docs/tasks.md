## 1. Pulse documentation

- [x] 1.1 Rewrite `packages/third-parties/pulse/readme.md`: fix the deprecation banner, replace install guidance with the Agenda v6 stack, add dependency/config/decorator/hook diffs and the AI migration note, move legacy usage under a dedicated section.
- [x] 1.2 Rewrite `docs/tutorials/pulse.md` with the same content using VitePress containers and npm/yarn/pnpm/bun code groups; update the page description metadata.
- [x] 1.3 Cross-link the Pulse migration guide from `docs/tutorials/agenda.md` and `packages/third-parties/agenda/readme.md`.

## 2. Package-level deprecation

- [x] 2.1 Add `@deprecated` TSDoc to the `@tsed/pulse` public API and the `pulse` configuration key.
- [x] 2.2 Prefix the `@tsed/pulse` package description with `[DEPRECATED]`.

## 3. Stop promoting Pulse

- [x] 3.1 Remove the Pulse card from `docs/index.md`.
- [x] 3.2 Label the sidebar entry "Pulse (deprecated)" in `docs/.vitepress/config.mts`.

## 4. Validation

- [x] 4.1 Run formatting and lint checks on the touched files (`oxfmt --check`, `oxlint`).
- [x] 4.2 Build the `@tsed/pulse` package to confirm the TSDoc changes compile (`lerna run build --scope @tsed/pulse --include-dependencies`).
- [x] 4.3 Render `docs/tutorials/pulse.md` and `docs/tutorials/agenda.md` through the VitePress markdown renderer to confirm containers, code groups, anchors and cross-links (full `docs:build` requires `api:build` first).
