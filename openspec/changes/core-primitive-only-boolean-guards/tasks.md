## 1. Tests first

- [x] 1.1 Add `packages/core/src/utils/isBoolean.spec.ts` covering every scenario of the `isBoolean` and `isBooleanOrBooleanClass` requirements, and check that the `isBoolean` scenarios for `Boolean` and `new Boolean()` fail on the current code
- [x] 1.2 Extend `packages/core/src/utils/isPrimitive.spec.ts` with the constructor, boxed and non-primitive scenarios of the `isPrimitive` requirement, plus the `isPrimitiveOrPrimitiveClass` and `isClass` scenarios, and check that only the `Boolean` / `new Boolean()` cases of `isPrimitive` fail on the current code

## 2. Implementation

- [x] 2.1 Narrow `isBoolean()` in `packages/core/src/utils/isBoolean.ts` to `typeof target === "boolean"`, leaving `isBooleanOrBooleanClass()` unchanged
- [x] 2.2 Remove the `target instanceof Boolean || target === Boolean` clause from `isPrimitive()` in `packages/core/src/utils/isPrimitive.ts`, keep the inlined typeof checks, and update its comment
- [x] 2.3 Update the `isPrimitive 1` snapshot in `packages/core/src/utils/__snapshots__/typeGuards.regression.spec.ts.snap` for `"Boolean"` and `"new Boolean"` only (from `true` to `false`), and check with `git diff` that no other snapshot entry changed

## 3. Verification

- [x] 3.1 Run the `@tsed/core` suite and the type check (`npx tsc --noEmit -p packages/core/tsconfig.esm.json`)
- [x] 3.2 Run the suites of the callers: `json-mapper`, `schema`, `platform-http`, `platform-response-filter`, `platform-router`, `platform-express`, `third-parties/sse`
- [x] 3.3 Run `yarn test:lint`
- [x] 3.4 Check with the benchmark of tsedio/tsed#3498 that `isPrimitive()` is not slower than on `perf/core`

## 4. Release

- [x] 4.1 Commit as `fix(core): make isBoolean and isPrimitive accept primitives only`, with a body naming `isBooleanOrBooleanClass()` / `isPrimitiveOrPrimitiveClass()` as the replacements
- [x] 4.2 Open the PR against `production` once tsedio/tsed#3498 is merged (or rebase on it), with a release note for the next minor version
