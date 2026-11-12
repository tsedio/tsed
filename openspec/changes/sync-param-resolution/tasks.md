# Tasks

## 1. Baseline

- [ ] 1.1 Rebase on the head of `perf/sync-handler-fast-path` (or on `production` once tsedio/tsed#3536 is merged), and verify that the `platform-params`, `ajv` and `json-mapper` suites pass before any change.
- [ ] 1.2 Record a baseline A/B (`tools/benchmarks`, Fastify then Express and Koa one at a time, `hello,users`, light settings from `.agents/lessons.md`) and a CPU profile of `/users/:id`. Verify that the numbers are written to `design.md` > Context.

## 2. Parameter resolution (`platform-params`)

- [ ] 2.1 Add failing tests for the `platform-param-resolution` scenarios: same-tick resolution with sync pipes, async pipe followed by a sync pipe, one async parameter among sync ones, thrown and rejected pipe errors wrapped in `ParamValidationError`. Verify that the same-tick tests fail on the current code.
- [ ] 2.2 Compile one resolver per parameter with `chain()` and explicit `isPromise` tests (D1, D2), and call the endpoint directly when no promise was met. Verify with the tests of 2.1 and the `platform-params` suite.
- [ ] 2.3 Make `getArg()` and `compile()` delegate to the compiled resolvers while keeping their `async` signatures. Verify that their existing tests pass unchanged.
- [ ] 2.4 Document `PipeMethods.transform()` as returning `MaybePromise` (JSDoc in `@tsed/schema`), update `reports/jsdoc/schema.md`, and verify with `yarn api:build`.

## 3. Validation (`ajv`, `ValidationPipe`)

- [ ] 3.1 Add failing tests for the `ajv-validation` scenarios: the same-tick method returns a value or throws `AjvValidationError` for a sync schema, returns a promise with `loadSchema` or `$async`, `validate()` still returns a promise, and coercion and cloning are unchanged.
- [ ] 3.2 Implement the same-tick method and make `validate()` delegate to it (D4). Add the optional method to `ValidatorServiceMethods`. Verify with 3.1 and the `ajv` suite.
- [ ] 3.3 Cache the schema, validator and options per parameter in `ValidationPipe`, and call the same-tick method when the validator has it (D3). Verify with a test that a third-party validator with only `validate()` still works, and with the `platform-params` suite.

## 4. JSON mapper (`json-mapper`)

- [ ] 4.1 List the tests that rely on `hasTypeMapperChanged` (a mapper changed in place), and choose the D5 variant (version only, or version plus the `hasConversion` flag). Verify by writing the choice in `design.md` > D5.
- [ ] 4.2 Add tests for the `json-mapper-type-mappers` scenarios: a mapper registered after the first call, a replaced mapper, a direct `.set()` and `.delete()` on the container, and an explicit `types` option.
- [ ] 4.3 Version `JsonMapperTypesContainer` and skip `syncTypeMappers()` when the container and version are unchanged (D5). Verify with 4.2 and the `json-mapper` suite.
- [ ] 4.4 Cache the options built from a `JsonParameterStore` and stop mutating the cached options in `map()` (D6). Verify with a test that two parameters with different groups and generics keep their own options, and with the `json-mapper` suite.
- [ ] 4.5 Update the JSDoc of the changed exported symbols, update `reports/jsdoc/json-mapper.md`, and verify with `yarn api:build`.

## 5. Value path (`ParseExpressionPipe`)

- [ ] 5.1 Compile the reader of each parameter (D7), and verify with the existing `ParseExpressionPipe` tests plus the header and empty-query scenarios of `platform-param-resolution`.

## 6. Integration

- [ ] 6.1 Run, one suite at a time, the suites of `platform-express`, `platform-koa`, `platform-fastify`, `platform-serverless`, `platform-multer`, `mongoose`, `passport` and `platform-mcp`, against the worktree sources (`.agents/lessons.md`). Verify that all pass, and compare any failure with the base branch.
- [ ] 6.2 Run `yarn test:lint` and the type check of the changed packages, and verify that both pass.

## 7. Measurement

- [ ] 7.1 Measure each of groups 2 to 5 on its own with the A/B loop on Fastify `/users/:id`, keep the steps whose gain is outside the noise (see `.agents/lessons.md` for the shared-utility exception), and verify by writing the numbers per step in `design.md`.
- [ ] 7.2 Run the final A/B on Express, Koa and Fastify (`hello,users`) and a profile of `/users/:id`. Verify by writing the req/s table in `tasks.md` and in the PR description.

## Workflow follow-up

- Open the PR against `production` after tsedio/tsed#3536 is merged, with release notes on the same-tick pipe path and the new AJV method.
- Once merged, sync the specs (`openspec-sync-specs`) and archive the change.
