### Ts.ED Core — JSDoc Coverage Tracker (packages/core/src)

Purpose

- Track documentation coverage for exported symbols in `packages/core/src`.
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

#### utils

- [x] packages/core/src/utils/deepClone.ts — `deepClone` lists the supported values, primitive wrappers included

---

Last updated: 2026-10-28
