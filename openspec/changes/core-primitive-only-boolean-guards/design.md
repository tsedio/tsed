## Context

`@tsed/core` exposes two families of primitive guards:

| Guard                           | String                                              | Number                  | Boolean                                             |
| ------------------------------- | --------------------------------------------------- | ----------------------- | --------------------------------------------------- |
| primitive only                  | `isString` (typeof)                                 | `isNumber` (typeof)     | `isBoolean` (**typeof + instanceof + constructor**) |
| primitive, constructor or boxed | `isStringOrStringClass`                             | `isNumberOrNumberClass` | `isBooleanOrBooleanClass`                           |
| aggregate, primitive only       | `isPrimitive`, which inherits the Boolean exception |                         |                                                     |
| aggregate, with classes         | `isPrimitiveOrPrimitiveClass`                       |                         |                                                     |

The split happened in v6.64.3 (00046b2bb1). That commit narrowed `isString` and `isNumber` and added the three `*OrClass` variants, but it left `isBoolean` with its old body. The JSDoc of `isBoolean` already describes the primitive-only behaviour.

On `perf/core` (tsedio/tsed#3498), `isPrimitive()` no longer calls `isBoolean()`. It inlines the typeof checks and keeps the `Boolean` exception explicitly (`target instanceof Boolean || target === Boolean`). The non-regression snapshot `typeGuards.regression.spec.ts.snap` records `isPrimitive(Boolean) === true` and `isPrimitive(new Boolean(false)) === true`.

All 19 call sites in the repository (15 `isBoolean`, 4 `isPrimitive`) receive runtime values, never metadata types. Code that works on types uses `isPrimitiveOrPrimitiveClass` (`isClass`, `JsonEntityStore.isPrimitive`, `primitiveOf`), which this change does not touch.

## Goals / Non-Goals

**Goals:**

- Make `isBoolean()` and `isPrimitive()` behave like `isString()`/`isNumber()`, so that the primitive-only guards are consistent and match their JSDoc.
- Keep `isBooleanOrBooleanClass()` and `isPrimitiveOrPrimitiveClass()`, and every guard built on them, unchanged.
- Lock the new behaviour with specs, and update the non-regression snapshot only for the two values that change on purpose.

**Non-Goals:**

- Changing how `deepClone()` copies boxed primitives (pre-existing problem for `Number`/`String`).
- Deprecating or renaming any guard.
- Touching callers: none relies on the removed cases.

## Decisions

### D1. Narrow `isBoolean()` to `typeof target === "boolean"`

This mirrors `isString()`/`isNumber()` exactly.

Alternatives considered:

- Add a new `isBooleanPrimitive()` and deprecate the current behaviour. This adds API surface to fix what is a bug against the function's own JSDoc and the 2021 split.
- Only fix `isPrimitive()`. This leaves the inconsistent `isBoolean()` exported, so the next caller would hit the same trap.

### D2. Narrow `isPrimitive()` to the three typeof checks

`isPrimitive()` becomes `type === "string" || type === "number" || type === "boolean"`. The explicit `instanceof Boolean || === Boolean` clause added on `perf/core` is removed. `isPrimitive()` keeps the inlined form from #3498 rather than calling back into `isBoolean()`, so the per-value hot path stays as fast as the #3498 benchmark. Inlining also keeps the behaviour explicit in one place.

### D3. Ship as `fix(core)` in the next minor version, with a release note

The v6.64.3 precedent narrowed `isString`/`isNumber` in a patch, without a note. Here the change is a fix against the documented contract. No caller in the repository depends on the removed cases, and only an application passing the `Boolean` constructor or `new Boolean()` to these guards can notice it.

A short release note names the replacement guards (`isBooleanOrBooleanClass`, `isPrimitiveOrPrimitiveClass`).

Alternative considered: wait for v9. This is safer for semver purists, but it keeps a known inconsistency for a long time, for a risk that the call-site review shows to be theoretical.

### D4. Tests

- Add `isBoolean.spec.ts` covering every scenario of the spec, including `isBooleanOrBooleanClass`.
- Extend `isPrimitive.spec.ts` with the constructor and boxed scenarios.
- Update the `isPrimitive 1` snapshot entries `"Boolean"` and `"new Boolean"` from `true` to `false`. Every other entry of the four snapshots MUST stay identical, which shows that `isClass`, `isTemporal` and `isPrimitiveOrPrimitiveClass` are unaffected.

## Risks / Trade-offs

- **[Risk]** An application uses `isBoolean(type)` or `isPrimitive(type)` on a `Boolean` metadata type, for example a custom converter.
  → Release note with the replacement guard. The fix is a one-word rename, and the behaviour now matches `String`/`Number`, which such code already had to handle.
- **[Risk]** A boxed `new Boolean()` in a response or a merged object now takes the object path. For example, `deepClone` copies it as an object whose `valueOf()` throws.
  → Same behaviour as `new Number()`/`new String()` today. Boxed booleans are not produced by JSON or by Ts.ED itself. The `deepClone` issue is a known non-goal.
- **[Trade-off]** Shipping a behaviour change as `fix` instead of waiting for a major version (see D3).

## Migration Plan

1. Land tsedio/tsed#3498 (`perf/core`) first, or rebase this change on `production` after it merges.
2. Implement D1 to D4. Run the `@tsed/core` suite and the suites of the callers: `json-mapper`, `schema`, `platform-http`, `platform-response-filter`, `platform-router`, `platform-express`, `sse`.
3. Release in the next minor version with a release note.

Rollback: revert the commit. No data or configuration is involved.

## Open Questions

- Should the release note also go to a migration page in `docs/`, or are the release notes enough? Defaulting to release notes only, like v6.64.3.
