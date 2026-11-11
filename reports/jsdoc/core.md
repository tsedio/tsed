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

- [x] packages/core/src/utils/AnyToPromise.ts — `call()` and the new `run()` document what is returned synchronously and what returns a promise
- [x] packages/core/src/utils/chain.ts — `chain` documents the same-tick and the promise paths, and the rejection without `onError`
- [x] packages/core/src/utils/deepClone.ts — `deepClone` lists the supported values, primitive wrappers included
- [x] packages/core/src/utils/isBoolean.ts — `isBoolean` is primitive only and points to `isBooleanOrBooleanClass` for constructors and wrappers
- [x] packages/core/src/utils/isPrimitive.ts — `isPrimitive` is primitive only and points to `isPrimitiveOrPrimitiveClass` for constructors and wrappers

#### types

- [x] packages/core/src/types/MaybePromise.ts — `MaybePromise` is a value or a promise of it, used by the same-tick APIs such as `chain`

---

Last updated: 2026-11-10
