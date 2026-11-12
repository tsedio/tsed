### Ts.ED Schema — JSDoc Coverage Tracker (packages/specs/schema/src)

Purpose

- Track documentation coverage for exported symbols in `packages/specs/schema/src`.
- Same rules as the other trackers: document exported symbols only, in English, without the `@example` tag.
- Status legend:
  - [x] Documented (English JSDoc present and conforms to symbols-only)
  - [~] Partial (basic JSDoc present, needs polish/validation)
  - [ ] Pending (no/insufficient JSDoc)

How to use

- Add a file below when you document or change the JSDoc of one of its exported symbols.
- Validate with `yarn api:build`.

---

## Summary table (per file)

#### components/stores

- [x] packages/specs/schema/src/components/stores/JsonParameterStore.ts — `PipeMethods` documents that `transform()` returns a value or a promise, the order of the pipes and the same-tick resolution

---

Last updated: 2026-11-12
