## Why

`isBoolean()` in `@tsed/core` is documented as "Checks if a value is a boolean primitive". But it also returns `true` for the `Boolean` constructor and for boxed `new Boolean()` values, which makes it identical to `isBooleanOrBooleanClass()`.

`isString()` and `isNumber()` became primitive-only in v6.64.3 (commit 00046b2bb1, "fix(core): simplify basic functions"). The same commit added `isBooleanOrBooleanClass()` but left `isBoolean()` unchanged. The inconsistency also reaches `isPrimitive()`, which today returns `true` for `Boolean` and `new Boolean()` but `false` for `String`, `Number`, `new String()` and `new Number()`.

## What Changes

- `isBoolean(value)` returns `true` only when `typeof value === "boolean"`, like `isString()` and `isNumber()`. **BREAKING** for code that passes the `Boolean` constructor or a `new Boolean()` object and expects `true`.
- `isPrimitive(value)` returns `true` only for string, number and boolean primitives. `Boolean` and `new Boolean()` are no longer primitives, matching `String`/`Number` and their boxed forms. **BREAKING** in the same edge cases.
- `isBooleanOrBooleanClass()` and `isPrimitiveOrPrimitiveClass()` are unchanged and remain the guards to use when the constructor or boxed values must be accepted.
- `isBoolean()` gets its own spec file, and the existing non-regression snapshot of `isPrimitive()` is updated for the two changed values.
- Release as `fix(core)` in the next minor version, with a release note. This follows the v6.64.3 precedent for `isString()`/`isNumber()`. No caller in the repository passes the `Boolean` constructor or a boxed boolean to these guards.

### Non-goals

- `deepClone()` copying boxed `Number`/`String` values (and, after this change, boxed `Boolean` values) as plain objects, whose `valueOf()` then throws. That problem exists today and is tracked separately.
- Any change to `isString()`, `isNumber()`, `isBooleanOrBooleanClass()`, `isPrimitiveOrPrimitiveClass()`, `isPrimitiveClass()` or `primitiveOf()`.

## Capabilities

### New Capabilities

- `core-type-guards`: behaviour of the primitive type guards exported by `@tsed/core` (`isBoolean`, `isString`, `isNumber`, `isPrimitive` and their `*OrClass` variants).

### Modified Capabilities

<!-- None: no existing spec covers these guards. `core-jsdoc-tracker` only covers documentation coverage. -->

## Impact

- **Code:**
  - `packages/core/src/utils/isBoolean.ts`;
  - `packages/core/src/utils/isPrimitive.ts`;
  - their specs;
  - `packages/core/src/utils/__snapshots__/typeGuards.regression.spec.ts.snap`.
- **Callers reviewed. All of them receive runtime values, never types, so they need no change:**
  - `isBoolean` (15 call sites):
    - `isSerializable`;
    - `DateMapper`, `TemporalMapper`;
    - the `$ignore` checks in `JsonSerializer`, `JsonDeserializer` and `alterIgnore`;
    - `alterOneOf`;
    - `PlatformResponse`;
    - `PlatformContentTypeResolver`;
    - SSE `EventStreamContext`;
    - `defineConfiguration`.
  - `isPrimitive` (4 call sites):
    - `deepClone`;
    - `deepMerge`;
    - `JsonSerializer`;
    - `PlatformLayer.inspect()`.
- **Observable effect:** a boxed `new Boolean()` now takes the same path as `new Number()` and `new String()` already do in these callers. For example, it is serialized or merged as an object instead of being returned as is.
- **Public API:** both guards are exported from `@tsed/core` (`src/index.ts`). Applications that rely on the old behaviour must switch to `isBooleanOrBooleanClass()` / `isPrimitiveOrPrimitiveClass()`.
- **Base:** builds on the `perf/core` branch (tsedio/tsed#3498), which inlines `isPrimitive()` and adds the non-regression snapshot.
