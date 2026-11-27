## Why

`isBoolean()` in `@tsed/core` is documented as "Checks if a value is a boolean primitive". But it also returns `true` for the `Boolean` constructor and for boxed `new Boolean()` values, which makes it identical to `isBooleanOrBooleanClass()`.

`isString()` and `isNumber()` became primitive-only in v6.64.3 (commit 00046b2bb1, "fix(core): simplify basic functions"). The same commit added `isBooleanOrBooleanClass()` but left `isBoolean()` unchanged. The inconsistency also reaches `isPrimitive()`, which today returns `true` for `Boolean` and `new Boolean()` but `false` for `String`, `Number`, `new String()` and `new Number()`.

Impact tests run against the real callers show that narrowing the two guards directly is not safe. 12 of 16 scenarios change across `core`, `di`, `json-mapper`, `schema`, `platform-http` and `platform-response-filter`. The worst cases:

- `deepClone()` returns a broken copy of a boxed boolean, whose `valueOf()` throws.
- `deepMerge()` throws on one.
- `@Constant()` returns a broken value when the configuration holds a boxed boolean.

The root cause is in `deepClone()`/`deepMerge()`, which cannot copy boxed primitives (already broken for `Number`/`String`). The Boolean case is only hidden by the `isPrimitive()` exception. The same tests also show that the old `isBoolean()` hides bugs of its own, for example `additionalProperties: new Boolean(false)` resolving to `true`.

## What Changes

The change is done in three steps, so that each step is verifiable on its own:

1. **Fix `deepClone()` and `deepMerge()` for boxed primitives.**
   - `deepClone()` returns a new boxed object holding the same value for `new Boolean()`, `new Number()` and `new String()`.
   - `deepMerge()` treats a boxed primitive as a leaf value, like a primitive.
   - This also fixes the existing problem with boxed `Number`/`String`.
2. **Check every caller against the impact tests.**
   - `deepClone()`/`deepMerge()` stop depending on the Boolean exception of `isPrimitive()`.
   - The `isBoolean()` callers keep `isBoolean()`: the review confirmed that they only receive `true`/`false` primitives (see design D3).
3. **Narrow `isBoolean()` and `isPrimitive()`** to primitives only, like `isString()`/`isNumber()`. **BREAKING** only for code that passes the `Boolean` constructor or a `new Boolean()` value to these guards, or to their callers listed below, and expects the old result.

Also:

- Add impact tests in each affected package. They pin the callers' results for `Boolean`, `new Boolean(true)`, `new Boolean(false)` and the primitives.
- Update the JSDoc tracker `reports/jsdoc/core.md` for the documented symbols, as `AGENTS.md` requires.
- Release as `fix(core)` in the next minor version, with a release note naming `isBooleanOrBooleanClass()` / `isPrimitiveOrPrimitiveClass()` as the replacements.

### Non-goals

- **Supporting `Boolean`/`new Boolean()` values in the `isBoolean()` callers.** They only receive `true`/`false` primitives.
- **Adding a `matchAll`-style parameter to the guards.** The `*OrClass` variants already cover that need.
- **Any change to** `isString()`, `isNumber()`, `isBooleanOrBooleanClass()`, `isPrimitiveOrPrimitiveClass()`, `isPrimitiveClass()` or `primitiveOf()`.

## Capabilities

### New Capabilities

- `core-type-guards`: behaviour of the primitive type guards exported by `@tsed/core` (`isBoolean`, `isPrimitive` and their `*OrClass` variants).
- `core-deep-copy`: how `deepClone()` and `deepMerge()` handle boxed primitives.

### Modified Capabilities

<!-- None: no existing spec covers these utilities. `core-jsdoc-tracker` only covers documentation coverage. -->

## Impact

- **Code in `@tsed/core`:**
  - `isBoolean.ts`, `isPrimitive.ts`;
  - `deepClone.ts`, `deepMerge.ts`;
  - `isSerializable.ts`;
  - their specs.
- **`isBoolean()` callers, which change only for `Boolean`/`new Boolean()` inputs:**
  - `isSerializable`;
  - `DateMapper`, `TemporalMapper`;
  - the `$ignore` checks in `JsonSerializer`, `JsonDeserializer` and `alterIgnore`;
  - `alterOneOf`;
  - `PlatformResponse`;
  - `PlatformContentTypeResolver`;
  - SSE `EventStreamContext`;
  - `defineConfiguration`.
- **`isPrimitive()` callers:**
  - `deepClone` and `deepMerge` are covered by step 1.
  - `JsonSerializer`: no observable change, according to the impact tests.
  - `PlatformLayer.inspect()`: debug output only.
- **Public API:**
  - `isBoolean()` and `isPrimitive()` are narrowed.
  - `deepClone()` and `deepMerge()` handle boxed primitives correctly.
- **Base:** `production`, after tsedio/tsed#3498 and tsedio/tsed#3505.
