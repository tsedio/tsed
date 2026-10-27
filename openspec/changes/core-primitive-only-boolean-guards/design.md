## Context

`@tsed/core` exposes two families of primitive guards:

| Guard                           | String                                              | Number                  | Boolean                                             |
| ------------------------------- | --------------------------------------------------- | ----------------------- | --------------------------------------------------- |
| primitive only                  | `isString` (typeof)                                 | `isNumber` (typeof)     | `isBoolean` (**typeof + instanceof + constructor**) |
| primitive, constructor or boxed | `isStringOrStringClass`                             | `isNumberOrNumberClass` | `isBooleanOrBooleanClass`                           |
| aggregate, primitive only       | `isPrimitive`, which inherits the Boolean exception |                         |                                                     |
| aggregate, with classes         | `isPrimitiveOrPrimitiveClass`                       |                         |                                                     |

The split happened in v6.64.3 (00046b2bb1). That commit narrowed `isString` and `isNumber` and added the three `*OrClass` variants, but it left `isBoolean` with its old body. Today `isBoolean` and `isBooleanOrBooleanClass` have the same body.

### Impact tests

A first version narrowed the two guards directly (tsedio/tsed#3499). The maintainer's review asked for the impact on `@tsed/schema`, `@tsed/di` and `@tsed/platform-http` to be measured first. Impact tests were therefore added: each package's real callers receive `true`, `false`, `Boolean`, `new Boolean(true)` and `new Boolean(false)`, and the results are recorded on the old guards and then compared on the narrowed ones. 12 of 16 scenarios change:

| Caller                                                           | Old guards                     | Narrowed guards               | Nature                     |
| ---------------------------------------------------------------- | ------------------------------ | ----------------------------- | -------------------------- |
| `deepClone(new Boolean(x))` (core)                               | correct value (same reference) | copy whose `valueOf()` throws | regression                 |
| `deepMerge({flag: true}, {flag: new Boolean(x)})` (core)         | returns the value              | throws `TypeError`            | regression                 |
| `@Constant()` on a boxed boolean config (di)                     | correct value                  | broken copy (via `deepClone`) | regression                 |
| `DateMapper`/`TemporalMapper` with a boxed boolean (json-mapper) | returned as is                 | 1970 date / `RangeError`      | regression, unlikely input |
| `isSerializable` (core)                                          | `false`                        | `true`                        | behaviour change           |
| `alterIgnore`, `$ignore: new Boolean(false)` (schema)            | ignored                        | not ignored                   | old behaviour is a bug     |
| `alterOneOf` boolean `enum` (schema)                             | keeps `Boolean`/boxed          | drops them                    | behaviour change           |
| `PlatformResponse.body()` (platform-http)                        | `end()`                        | `json()`                      | behaviour change           |
| `additionalProperties: new Boolean(false)` (platform-http)       | `true`                         | `false`                       | old behaviour is a bug     |
| `getContentType(Boolean)` (platform-response-filter)             | JSON                           | none                          | behaviour change           |

Two conclusions:

- The regressions come from `deepClone`/`deepMerge`, which cannot copy boxed primitives. They are already broken for `new Number()`/`new String()`, and the `isPrimitive` Boolean exception was only hiding the Boolean case.
- Several callers depend on the old `isBoolean`, sometimes in a way that is itself a bug.

## Goals / Non-Goals

**Goals:**

- Make `isBoolean()` and `isPrimitive()` behave like `isString()`/`isNumber()` without changing the behaviour of any caller in the repository.
- Fix `deepClone()`/`deepMerge()` for boxed primitives, which is the root cause of the regressions.
- Keep the impact tests as a permanent guard.

**Non-Goals:**

- Fixing the caller bugs the old `isBoolean` hides (`additionalProperties`, `$ignore` with `new Boolean(false)`). They are kept as is in step 2 and listed below for follow-up changes.
- Adding a `matchAll` parameter to the guards. `isBooleanOrBooleanClass()` / `isPrimitiveOrPrimitiveClass()` already express "accept constructors and boxed values", and a parameter would give two ways to say the same thing.

## Decisions

### D1. Three steps, in this order, with the impact snapshots as the oracle

1. Fix `deepClone`/`deepMerge` (D2).
2. Move callers to the explicit guards (D3).
3. Narrow the guards (D4).

The snapshots recorded on the old guards MUST stay identical after each step. The only exception is new expectations for boxed `Number`/`String` in `deepClone`/`deepMerge`, which are bug fixes covered by the `core-deep-copy` spec.

### D2. `deepClone`/`deepMerge` handle boxed primitives explicitly

- **`deepClone`** recreates a boxed `Boolean`/`Number`/`String` from its `valueOf()`. Before this change, the boxed boolean was returned as is, because `isPrimitive` accepted it. A new object is the correct semantics for a clone, and the value is the same.
- **`deepMerge`** treats a boxed primitive `obj` as a leaf, like a primitive (`shouldReturnObj`).

The check is a direct `instanceof Boolean || instanceof Number || instanceof String`. It is not a new exported helper, to avoid adding public API for an internal concern.

Alternative considered: keep calling `isPrimitiveOrPrimitiveClass()`. It also matches the `String`/`Number`/`Boolean` constructors, which these functions must keep handling as functions, so it would change their behaviour.

### D3. Callers switch to `isBooleanOrBooleanClass()`

`isBoolean` and `isBooleanOrBooleanClass` have the same body today, so replacing one with the other changes nothing. This applies to:

- `isSerializable`;
- `DateMapper`, `TemporalMapper`;
- the `$ignore` checks in `JsonSerializer`, `JsonDeserializer` and `alterIgnore`;
- `alterOneOf`;
- `PlatformResponse`;
- `PlatformContentTypeResolver`;
- SSE `EventStreamContext`;
- `defineConfiguration`.

Each of these callers can later move back to the narrowed `isBoolean` once its own behaviour change is wanted. For example, fixing the `additionalProperties` and `$ignore` bugs would mean `isBoolean` plus `valueOf()`, which is out of scope here.

`isPrimitive` callers:

- `deepClone`/`deepMerge` are covered by D2.
- `JsonSerializer` shows no observable change in the impact tests, so it keeps `isPrimitive`.
- `PlatformLayer.inspect()` is debug output only, so it keeps `isPrimitive`.

### D4. Narrow `isBoolean()` and `isPrimitive()`

`isBoolean()` becomes `typeof target === "boolean"`. `isPrimitive()` keeps the inlined typeof checks from #3498, without the `instanceof Boolean || === Boolean` clause. The guard specs (`isBoolean.spec.ts`, `isPrimitive.spec.ts`) and the `isPrimitive` entries of the #3498 non-regression snapshot (`"Boolean"`, `"new Boolean"`) change accordingly. Nothing else may change.

### D5. Release as `fix(core)` in the next minor version, with a release note

After D3, only application code that passes `Boolean`/`new Boolean()` to these two guards can notice the change. The release note names the replacement guards.

## Risks / Trade-offs

- **[Risk]** An application relies on `isBoolean(Boolean)` or `isPrimitive(new Boolean())`.
  → The release note gives the replacement, a one-word rename.
- **[Risk]** `deepClone` now returns a copy instead of the same reference for a boxed boolean.
  → This is the expected semantics of a clone. The value is unchanged, the impact tests check that, and `@Constant` freezes the copy as before.
- **[Trade-off]** Step 2 keeps two known bugs (`additionalProperties`, `$ignore` with `new Boolean(false)`) so that the change stays behaviour-neutral for callers. They are documented for follow-up.

## Migration Plan

1. Land tsedio/tsed#3498 (`perf/core`) first. This branch is stacked on it.
2. Implement D2, D3 and D4 as three commits, in that order. Run the impact tests after each one.
3. Run the suites of the affected packages, `yarn test:lint`, the type check and `yarn api:build`.
4. Release in the next minor version with a release note.

Rollback: revert the commits, in reverse order. No data or configuration is involved.

## Open Questions

- Fix the `additionalProperties` and `$ignore` bugs in follow-up changes? They are listed here as candidates.
