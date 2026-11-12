# Tasks

## 1. Baseline

- [x] 1.1 Rebase on the head of `perf/sync-handler-fast-path` (or on `production` once tsedio/tsed#3536 is merged), and verify that the `platform-params`, `ajv` and `json-mapper` suites pass before any change.
- [x] 1.2 Record a baseline A/B (`tools/benchmarks`, Fastify then Express and Koa one at a time, `hello,users`, light settings from `.agents/lessons.md`) and a CPU profile of `/users/:id`. Verify that the numbers are written to `design.md` > Context.

## 2. Parameter resolution (`platform-params`)

- [x] 2.1 Add failing tests for the `platform-param-resolution` scenarios: same-tick resolution with sync pipes, async pipe followed by a sync pipe, one async parameter among sync ones, thrown and rejected pipe errors wrapped in `ParamValidationError`. Verify that the same-tick tests fail on the current code.
- [x] 2.2 Compile one resolver per parameter with `chain()` and explicit `isPromise` tests (D1, D2), and call the endpoint directly when no promise was met. Verify with the tests of 2.1 and the `platform-params` suite.
- [x] 2.3 Make `getArg()` and `compile()` delegate to the compiled resolvers while keeping their `async` signatures. Verify that their existing tests pass unchanged.
- [x] 2.4 Document `PipeMethods.transform()` as returning `MaybePromise` (JSDoc in `@tsed/schema`), update `reports/jsdoc/schema.md`, and verify with `yarn api:build`.

## 3. Validation (`ajv`, `ValidationPipe`)

- [x] 3.1 Add failing tests for the `ajv-validation` scenarios: the same-tick method returns a value or throws `AjvValidationError` for a sync schema, returns a promise with `loadSchema` or `$async`, `validate()` still returns a promise, and coercion and cloning are unchanged.
- [x] 3.2 Implement the same-tick method and make `validate()` delegate to it (D4). Add the optional method to `ValidatorServiceMethods`. Verify with 3.1 and the `ajv` suite.
- [x] 3.3 Cache the schema, validator and options per parameter in `ValidationPipe`, and call the same-tick method when the validator has it (D3). Verify with a test that a third-party validator with only `validate()` still works, and with the `platform-params` suite.

## 4. JSON mapper (`json-mapper`)

- [x] 4.1 List the tests that rely on `hasTypeMapperChanged` (a mapper changed in place), and choose the D5 variant (version only, or version plus the `hasConversion` flag). Verify by writing the choice in `design.md` > D5.
- [x] 4.2 Add tests for the `json-mapper-type-mappers` scenarios: a mapper registered after the first call, a replaced mapper, a direct `.set()` and `.delete()` on the container, and an explicit `types` option.
- [x] 4.3 Version `JsonMapperTypesContainer` and skip `syncTypeMappers()` when the container and version are unchanged (D5). Verify with 4.2 and the `json-mapper` suite.
- [x] 4.4 Cache the options built from a `JsonParameterStore` and stop mutating the cached options in `map()` (D6). Verify with a test that two parameters with different groups and generics keep their own options, and with the `json-mapper` suite.
- [x] 4.5 Update the JSDoc of the changed exported symbols, update `reports/jsdoc/json-mapper.md`, and verify with `yarn api:build`.

## 5. Value path (`ParseExpressionPipe`)

- [x] 5.1 Compile the reader of each parameter (D7), and verify with the existing `ParseExpressionPipe` tests plus the header and empty-query scenarios of `platform-param-resolution`.

## 6. Integration

- [x] 6.1 Run, one suite at a time, the suites of `platform-express`, `platform-koa`, `platform-fastify`, `platform-serverless`, `platform-multer`, `mongoose`, `passport` and `platform-mcp`, against the worktree sources (`.agents/lessons.md`). Verify that all pass, and compare any failure with the base branch.
- [x] 6.2 Run `yarn test:lint` and the type check of the changed packages, and verify that both pass.

## 7. Measurement

- [x] 7.1 Measure each of groups 2 to 5 on its own with the A/B loop on Fastify `/users/:id`, keep the steps whose gain is outside the noise (see `.agents/lessons.md` for the shared-utility exception), and verify by writing the numbers per step in `design.md`.
- [x] 7.2 Run the final A/B on Express, Koa and Fastify (`hello,users`) and a profile of `/users/:id`. Verify by writing the req/s table in `tasks.md` and in the PR description.

### Results of 7.2

A/B of this branch (`local`) against the head of tsedio/tsed#3536 (`c2ed29e05b`, `local-base`), one platform at a time, `--rounds 5 --startups 1 --no-raw`, macOS (no CPU pinning, gaps under ~3% are not reliable). Δ is the geometric mean of the per-round ratios, with its 95% interval.

| Platform | Route            | Base req/s | Branch req/s | Δ req/s                                | Δ CPU/req                            |
| -------- | ---------------- | ---------: | -----------: | -------------------------------------- | ------------------------------------ |
| Express  | `GET /hello`     |     31,106 |       31,530 | +12.9% [-12.7; +46.1], not significant | +6.5% [-8.0; +23.2], not significant |
| Express  | `GET /users/:id` |     17,854 |       22,782 | **+39.2%** [+1.7; +90.4]               | **+32.4%** [+10.6; +58.5]            |
| Koa      | `GET /hello`     |     46,448 |       45,789 | -6.1% [-15.8; +4.7], not significant   | -2.7% [-9.4; +4.6], not significant  |
| Koa      | `GET /users/:id` |     24,267 |       30,914 | **+30.8%** [+21.3; +41.1]              | **+28.6%** [+22.2; +35.3]            |
| Fastify  | `GET /hello`     |     50,646 |       52,694 | +1.2% [-8.8; +12.3], not significant   | -0.3% [-9.3; +9.5], not significant  |
| Fastify  | `GET /users/:id` |     28,619 |       38,819 | **+28.2%** [+17.4; +40.0]              | **+29.5%** [+21.1; +38.4]            |

`/hello` has no parameter, so it does not go through the changed code: its gaps stay inside the noise, as expected. The Express interval on `/users/:id` is wide (one noisy round), but its CPU per request agrees with Koa and Fastify.

CPU profile of Fastify `/users/:id` (`--cpu-prof`, 10 s under `autocannon -c 50` after a 3 s warmup, same app for both targets):

|                                                                     |   Base |    Branch |
| ------------------------------------------------------------------- | -----: | --------: |
| Requests in the profiled window                                     |   294k |      397k |
| Busy CPU per request (profiler on)                                  | ~43 µs |    ~30 µs |
| Share of `@tsed/*` code in busy CPU                                 |   ~41% |      ~23% |
| `isTypeMapperOutdated` + `syncTypeMappers` + `hasTypeMapperChanged` |  11.4% |      1.8% |
| `getArg` (platform-params)                                          |   2.8% | no sample |

What is left in `@tsed/*` is mostly the response side: `JsonSerializer.mapOptions()` (2.0%) and the compiled mapper code, which are out of scope here (see design, Non-Goals).

## Workflow follow-up

- Open the PR against `production` after tsedio/tsed#3536 is merged, with release notes on the same-tick pipe path and the new AJV method.
- Once merged, sync the specs (`openspec-sync-specs`) and archive the change.
