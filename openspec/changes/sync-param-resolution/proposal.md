# Proposal

## Why

`sync-handler-fast-path` (tsedio/tsed#3536) made routes without parameters complete in the same tick, but a route with parameters still waits for promises at every step: the `async` wrapper of the handler, `Promise.all()` over the arguments, and an `await` for every pipe of every parameter, including the AJV validation that is synchronous for nearly every schema. On Fastify, `GET /users/:id` costs about 29 µs per request against 18 µs for `/hello`. The profile puts most of the gap in `processTicksAndRejections` (24.7 µs inclusive against 1.6), then in work repeated on each request: type mapper sync in json-mapper (2.4 µs), schema and validator lookup (1.2 µs), and option copies. The estimate is about +25% req/s on that route. That number is not verified yet: task 7 measures it.

## What Changes

- The arguments of an endpoint are resolved without waiting for a microtask when every pipe of every parameter returns a plain value. A pipe that returns a promise is still awaited, and the arguments resolved after it wait for it.
- The pipe contract (`PipeMethods.transform()`) is documented as "value or promise" (`MaybePromise`). The type already allows it. Pipes keep running in priority order, and an error from a pipe, thrown or rejected, is still wrapped in `ParamValidationError`.
- `ValidationPipe` builds the schema and picks the validator once per parameter, not on each request.
- `@tsed/ajv`: a new `AjvService` method validates and returns the value directly when the compiled validator is synchronous. It returns a promise only for `$async` schemas or when `ajv.loadSchema` is set. `validate()` keeps its signature and still returns a promise. `ValidatorServiceMethods` gets the matching optional method, so third-party validators keep working without it.
- `@tsed/json-mapper`: `deserialize()` and `serialize()` no longer walk every registered type mapper on each call. They resync only when the type mapper registry changed. The options built from a `JsonParameterStore` are computed once per parameter.
- `ParseExpressionPipe` reads the value through a path compiled once per parameter, instead of parsing the expression on each request.
- No **BREAKING** change is planned. `PlatformParams.getArg()` and `compile()` keep their public signature, and the fast path is a new internal path. A custom pipe that returns a plain value now runs in the same tick as the next pipe. A pipe that relied on a microtask between two pipes would see a different order of side effects (see design.md, Risks).

## Capabilities

### New Capabilities

- `platform-param-resolution`: how the parameters of an endpoint are resolved (the order of the pipes, same-tick resolution, waiting for asynchronous pipes, errors), on every platform.
- `ajv-validation`: what `AjvService` returns and when it returns a promise, including the validation entry point that has no promise.
- `json-mapper-type-mappers`: when a type mapper registered, replaced or changed after the first mapping is taken into account by `serialize()` and `deserialize()`.

### Modified Capabilities

None. `platform-request-pipeline` (from `sync-handler-fast-path`) is not archived yet, and its requirements do not change: this change only adds the parameter step before the endpoint runs.

## Impact

- Code:
  - `packages/platform/platform-params`: `PlatformParams`, `ParseExpressionPipe`, `ValidationPipe`, `DeserializerPipe`, `ValidatorServiceMethods`.
  - `packages/specs/ajv`: `AjvService`.
  - `packages/specs/json-mapper`: `JsonMapperCompiler.syncTypeMappers`, `JsonDeserializer.mapOptions`, `JsonSerializer.mapOptions`, the type mapper registry.
- Public API:
  - new `AjvService` method and new optional `ValidatorServiceMethods` method (names in design.md);
  - documented return type `MaybePromise` for `PipeMethods.transform()`.
  - JSDoc trackers to update: `reports/jsdoc/json-mapper.md`, `reports/jsdoc/schema.md`.
- Depends on tsedio/tsed#3536 (`chain()`, `MaybePromise`, the same-tick handler path). This branch is built on it and has to be rebased once it is merged.
- Suites to run: `platform-params`, `ajv`, `json-mapper`, `schema`, the three platform adapters, and packages with custom pipes or validators (`platform-multer`, `mongoose`, `passport`, `platform-mcp`).
