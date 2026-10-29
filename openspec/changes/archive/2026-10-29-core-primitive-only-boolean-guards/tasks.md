## 1. Impact tests (oracle)

- [x] 1.1 Add `isBoolean.spec.ts` and extend `isPrimitive.spec.ts` with every scenario of the `core-type-guards` spec
- [x] 1.2 Add `booleanGuards.impact.spec.ts` in `core`, `di`, `json-mapper`, `schema`, `platform-http` and `platform-response-filter`, and record their snapshots on the old guards (from `perf/core`)
- [x] 1.3 Run the impact tests on the narrowed guards, and record the 12 changed scenarios in `design.md`

## 2. Step 1: deepClone and deepMerge

- [x] 2.1 Add specs for the `core-deep-copy` scenarios (boxed `Boolean`/`Number`/`String`, nested, constructors, `deepMerge` leaf), and check that they fail on the current code where expected
- [x] 2.2 Make `deepClone()` recreate boxed `Boolean`/`Number`/`String` objects from their `valueOf()` (superseded by the version of tsedio/tsed#3505, kept on merge)
- [x] 2.3 Make `deepMerge()` return a boxed primitive `obj` as a leaf value
- [x] 2.4 Check that the impact snapshots recorded on the old guards still match with the old guards, and commit as `fix(core): ...`

## 3. Step 2: callers use the explicit guards

- [x] 3.1 Replace `isBoolean` with `isBooleanOrBooleanClass` in `isSerializable`, `DateMapper`, `TemporalMapper`, `JsonSerializer`/`JsonDeserializer` (`$ignore`), `alterIgnore`, `alterOneOf`, `PlatformResponse`, `PlatformContentTypeResolver`, SSE `EventStreamContext` and `defineConfiguration`
- [x] 3.2 Check that every impact snapshot still matches, and commit as `refactor(...)` per package scope, or a single `refactor` commit where commitlint allows it

## 4. Step 3: narrow the guards

- [x] 4.1 Narrow `isBoolean()` to `typeof target === "boolean"` and drop the Boolean exception from `isPrimitive()`
- [x] 4.2 Update only the `"Boolean"` / `"new Boolean"` entries of the `isPrimitive` non-regression snapshot
- [x] 4.3 Check that every impact snapshot still matches the one recorded on the old guards

## 5. Verification and release

- [x] 5.1 Run the suites of `core`, `di`, `hooks`, `json-mapper`, `schema`, `ajv`, `platform-http`, `platform-params`, `platform-router`, `platform-response-filter`, `platform-express` and `third-parties/sse`, plus the type checks of the touched packages
- [x] 5.2 Run `yarn test:lint` and `yarn api:build`, and record the documented symbols and the validation result in `reports/jsdoc/core.md`
- [x] 5.3 Push, update the PR description (impact table, release note), and reply to the review threads

## 6. Review: callers keep `isBoolean()`

- [x] 6.1 Move the callers of 3.1 back to `isBoolean()`, SSE `EventStreamContext` included
- [x] 6.2 Update the impact snapshots, and check that only the `Boolean`/`new Boolean()` entries of these callers change
- [x] 6.3 Run the suites of 5.1, the type check and `yarn test:lint`
- [x] 6.4 Push, update the PR description, and reply to the review threads
