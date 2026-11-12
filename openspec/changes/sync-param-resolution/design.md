# Design

## Context

For the motivation and the profile, see proposal.md. Current state, on top of tsedio/tsed#3536:

- `PlatformParams.compileHandler()` returns a fast path only when the endpoint has no parameter. With parameters, it returns an `async` wrapper that does `await Promise.all([getInstance(scope), getArguments(scope)])`. `compile()` does a `Promise.all()` over the arguments, and `getArg()` is `async` and does `for await (const pipe of pipes) value = await pipe.transform(value, param)`.
- `PipeMethods.transform(value, metadata): R` already allows a plain value. Every built-in pipe returns one, except `ValidationPipe`, which returns the promise of `ValidatorServiceMethods.validate()`.
- `ValidationPipe.transform()` calls `compile(metadata, {customKeys: true})` and `validators.get("default")` on each request. `AjvService.validate()` is `async`. It awaits `getValidator()` (which is `async` only for `compileAsync`), then awaits the boolean returned by a synchronous AJV validator.
- `JsonDeserializer.mapOptions()` and `JsonSerializer.mapOptions()` call `syncTypeMappers()` on each call. It walks every registered mapper and runs `isTypeMapperOutdated()` on it (4 lookups each). When given a `JsonParameterStore`, `mapOptions()` also rebuilds the options from the store (`getBestType()`, `schema().getGroups()`, `getGenericOf()`) and copies them twice.
- The type mapper registry, `JsonMapperTypesContainer`, is a plain exported `Map`: code can call `.set()` or `.delete()` on it directly.
- `ParseExpressionPipe` already caches the key of each parameter. `getValue()` walks the key with `indexOf`/`slice` on each request.

Constraints:

- `.agents/lessons.md`, "Keep the microtasks of an async API": public `async` methods (`getArg()`, `AjvService.validate()`) keep their promise. The same-tick path is a new path used by the framework, not a change of those methods.
- Same ordering, error and status guarantees on Express, Koa, Fastify and serverless (see the specs).

## Goals / Non-Goals

**Goals:**

- No microtask between pipes and between parameters when they are all synchronous.
- No per-request work that depends only on the parameter's metadata: schema, validator, deserializer options, value path.
- No per-call walk of the type mapper registry when it did not change.

**Non-Goals:**

- Changing the JSON mapper's generated code, or AJV itself.
- Running `getInstance()` and the arguments in parallel when both are synchronous. Order stays instance, then arguments, which is the order observable today for a synchronous instance.
- Making the request-scoped instance path (`ProviderScope.REQUEST`) synchronous when the DI returns a promise.
- Response serialization (`serialize()` of the endpoint result), except for the shared `syncTypeMappers()` cache.

## Decisions

### D1. Compile a resolver per parameter, chained with `chain()`

At `compileHandler()` time, each parameter gets a resolver that runs its pipes with `chain()` from `@tsed/core` (added by #3536): it continues in the same tick on a value and awaits only a promise. The arguments are collected in an array. The first argument that returns a promise switches the rest of the resolution to a promise path that keeps declaration order. The handler calls the method directly when no promise was met. Errors, thrown or rejected, go through the same `ParamValidationError.from(param, er)`.

`getArg()` and `compile()` stay public and `async`, built on the same resolvers, for their external callers.

_Alternatives:_

- Making `getArg()` return `MaybePromise`: it changes a public signature, which the lesson above rules out.
- Running all parameters with `Promise.all()` only when one of them is async: that keeps the same order of pipe calls (each parameter's pipes run in declaration order until the first promise), so it is the chosen behaviour for the async path.

### D2. Explicit `isPromise` tests in the hot loop

As in #3536 (D1 there), the loop over pipes uses an explicit `isPromise(value)` test instead of a closure per step on the synchronous path, because closures showed up in the profile.

### D3. `ValidationPipe` resolves its schema and validator once per parameter

A `WeakMap<JsonParameterStore, {schema, validator, options}>` is filled on the first request for a parameter. `coerceTypes()`, `checkIsRequired()` and the `skip()` test stay per request, since they depend on the value.

_Alternative:_ computing it in `compileHandler()`. Rejected: pipes are independent of the compiler, and custom pipes extend `ValidationPipe`.

### D4. A same-tick method on `AjvService` and on `ValidatorServiceMethods`

`AjvService` gets a method that does what `validate()` does and returns the value directly when the validator is synchronous. It returns a promise only when `getValidator()` needs `compileAsync` (`loadSchema`) or the compiled validator is `$async` (`validate.$async === true`). `validate()` becomes `async validate(...) { return this.<method>(...) }`, so both stay identical, errors included. `ValidatorServiceMethods` gets the same method as optional. `ValidationPipe` calls it when the validator has it, and `validate()` otherwise, so third-party validators keep working.

The proposed name is `validateValue()`. Alternatives considered: `run()` (matches `AnyToPromise.run()` but says nothing about validation), and `validateSync()` (wrong, since it may return a promise). The name can be changed during review without changing the specs.

### D5. Version the type mapper registry

`JsonMapperTypesContainer` becomes an instance of a `Map` subclass that bumps a version on `set()`, `delete()` and `clear()`, so code that calls `.set()` directly is still covered. `syncTypeMappers()` stores the container and version it synced last, and returns at once when both are unchanged. A `types` option that is a different container triggers a sync for that container, as today (see spec `json-mapper-type-mappers`).

_Alternative:_ syncing at `@JsonMapper()` registration only. Rejected, because a direct `.set()` on the exported map would then be missed.

_Chosen variant (task 4.1):_ version plus a light check of each synced entry. Tests rely on a mapper whose method is replaced in place, so the fast path also compares the container, its version, a change counter of the compiler's own mappers, and runs `hasTypeMapperChanged()` on the entries already synced (one check per entry instead of the four lookups of `isTypeMapperOutdated()`). The profile shows the remaining cost: 1.8% of busy CPU on Fastify `/users/:id`, against 11.4% before.

_Existing limits kept (checked on the base branch):_ a model that is already compiled does not see a mapper registered later, and a mapper removed from the registry is still used by the models compiled with it. The spec `json-mapper-type-mappers` describes this behaviour instead of a stricter one.

### D6. Cache the deserializer options of a parameter store

`mapParamStoreOptions(store, options)` results are cached per `JsonParameterStore`, when the only other options are the constant ones `DeserializerPipe` passes (the `useAlias: true` and `param.store.get(DeserializerPipe)` defaults). The final `mapOptions()` result for a store is cached the same way, and `map()` stops mutating it (it sets `collectionType` on the options object today, which needs a copy first).

### D7. Compile the value path of a parameter

`ParseExpressionPipe` caches a reader per parameter (a split key array, or a direct property read for a one-segment key), with the same `readKey()` rules as `getValue()`: own value, `in` test, `.get()` fallback, stop on a falsy value.

## Risks / Trade-offs

- [The order of the pipe calls **across** parameters changes.] → Before, `Promise.all()` started every parameter, so the first pipe of each parameter ran before the second pipe of any of them. Now a parameter runs all its synchronous pipes before the next parameter starts. The order within a parameter does not change. Only a pipe that reads state written by a pipe of another parameter can see the difference. Mention it in the release notes.
- [A custom pipe relied on a microtask between pipes, for example to read state set by a `then` elsewhere.] → The order of the pipe calls within a parameter does not change, only the ticks between them. Mention it in the release notes, and run the suites of the packages that ship pipes (multer, mongoose, passport, platform-mcp).
- [A registered mapper object that is changed in place (a `deserialize` method added after registration) is no longer detected until the map changes.] → `hasTypeMapperChanged` exists for this case. Before dropping it from the fast path, task 4.1 checks which tests rely on it. If one does, the version check also compares the `hasConversion` flag of the mappers already synced, which costs one lookup per mapper instead of four.
- [The per-parameter caches hold stale schemas when a test changes a store's schema after the first request.] → The caches are `WeakMap`s keyed by store. Tests that change metadata after bootstrap build a new app, and therefore new stores. The same assumption is already made by the `validatorsBySchema` cache.
- [Two code paths (`getArg()` and the compiled resolver) drift apart.] → `getArg()` delegates to the compiled resolver.
- [The gain is lower than the estimate.] → Task 7 measures each step on its own (A/B on Fastify `/users/:id`, then Express and Koa). Steps inside the noise of the A/B loop are dropped, except shared-utility gains of about 5% (see lessons).

## Measurements

Task 7.1, A/B on Fastify `/users/:id`, each step cumulated on the previous ones, against the head of tsedio/tsed#3536 (about 40,900 req/s on that run):

| Step                                                             | Δ req/s (cumulated)             |
| ---------------------------------------------------------------- | ------------------------------- |
| Parameters in the same tick (group 2)                            | +4.4% (inside the noise)        |
| + AJV `validateValue()` and the `ValidationPipe` cache (group 3) | +10.6%                          |
| + json-mapper registry version and store options cache (group 4) | +19.4%                          |
| + compiled value reader of `ParseExpressionPipe` (group 5)       | **+24.4%** (about 50,100 req/s) |

Group 2 alone is inside the noise but is kept: groups 3 to 5 only pay off once no promise is left between pipes, and the remaining steps would otherwise wait on a microtask per parameter.

The final A/B and profile of task 7.2 are in `tasks.md`: +28% to +39% req/s on `/users/:id` for Express, Koa and Fastify, `/hello` unchanged.

## Migration Plan

No migration for applications. Branch `perf/sync-param-resolution` is built on `perf/sync-handler-fast-path`. Rebase it on `production` once tsedio/tsed#3536 is merged, then open the PR. Rollback is a revert: no stored data or configuration changes.

## Open Questions

- Final name of the same-tick AJV method (D4). It does not change the specs or the tasks.
