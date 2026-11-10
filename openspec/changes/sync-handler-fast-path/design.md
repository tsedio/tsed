# Design

## Context

See proposal.md (Why) for the numbers. Today a request goes through these steps, each forcing a promise:

| Step                        | File                                                                                 | Why it is async today                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Adapter wrapper per handler | `PlatformExpress.mapHandler`, `PlatformKoa.mapHandler`, `PlatformFastify.mapHandler` | `async` closure + `catchAsyncError` (Express, Koa) or `await runInContext` (Fastify middlewares)                                      |
| Fastify route handler       | `PlatformFastify.compose`                                                            | `runInContext(…, async () => { for … await metadata.compiledHandler($ctx) })`, returns `reply` from a promise (Fastify thenable path) |
| Handler call                | `PlatformHandler.onRequest`                                                          | `async`, `await resolver.call(handler)`                                                                                               |
| Result classification       | `AnyToPromise.call`                                                                  | creates a `new Promise` in the constructor, always returns it                                                                         |
| Response                    | `PlatformHandler.flush`                                                              | `async`, `await responseFilter.transform(...)`                                                                                        |
| Response filter             | `PlatformResponseFilter.transform` / `serialize` / `renderView`                      | all `async`; `serialize()` is synchronous work wrapped in `async`                                                                     |
| Serverless                  | `PlatformServerlessHandler.createHandler`                                            | `await promisedHandler` (a function, not a promise), `await resolver.call`                                                            |

`PlatformParams.compileHandler` already returns a plain value for a handler without parameter (PR #3524). Handlers with parameters still return a promise (`Promise.all` over the pipes). That keeps their path async, which is correct.

Constraints:

- The `.agents/lessons.md` rule "Keep the microtasks of an async API when optimizing it": no public async API may lose its promise; the synchronous path is added next to it. `runInContext()` is the one deliberate exception (D6): it returns a value instead of a promise, and the change is documented as breaking.
- Callers outside the pipeline use `transform()` (`@tsed/sse`, `@tsed/formio`) and `AnyToPromise.call()` (`@tsed/platform-serverless`).
- `PlatformExpressHandler` overrides `onResponse` and may return a promise (a returned Express middleware). `PlatformKoaHandler` overrides `onRequest` and `flush`.

## Goals / Non-Goals

**Goals:**

- A route whose handlers are all synchronous runs end to end without a microtask, on Express, Fastify and serverless. On Koa, it runs without any promise of Ts.ED's own.
- One shared mechanism, maybe-promise steps in `platform-http`, that every adapter uses the same way. No Fastify-only special case in the shared code.

**Non-Goals:**

- Making handlers with parameters synchronous: the pipes and `Promise.all` in `PlatformParams` stay as they are. That can be a later change, once this one is measured.
- Changing how `AsyncLocalStorage` is used (one `storage.run()` per handler), the request id or middie: they are separate leads in tsedio/tsed#3523. Only the return contract of `runInContext()` changes (D6).
- Changing the async contract of `$onRequest` / `$onResponse`.

## Decisions

### D1. Maybe-promise steps, with an explicit branch at each step

Each pipeline step returns either a value or a promise. The caller does `isPromise(r) ? r.then(next) : next(r)`, with `isPromise` from `@tsed/core`.

- **Alternative 1:** always `await`, plus a cheap `Promise.resolve()`. This keeps one microtask per step, which is exactly the cost being removed.
- **Alternative 2:** a generic `sync()`/"maybe" monad helper. It hides the branch but allocates a closure per step on the hot path.

The explicit branch costs nothing when the value is synchronous. It is repeated in about 6 places, which is acceptable.

### D2. `AnyToPromise.run()` next to `call()`

`run(cb)` classifies the result of `cb()` and returns the `AnyPromiseResult` directly for:

- a plain value;
- a `Buffer`;
- a stream;
- an HTTP response object, unless its `data` is a promise;
- a canceled response.

It returns a promise only for promises, observables, or when a `next` function was requested (`hasNextFunction`).

- The internal `#promise` becomes lazy: it is created only when `run()` takes the async path, or when `call()` is used.
- `call(cb)` stays `Promise<AnyPromiseResult>` and becomes `const r = this.run(cb); return isPromise(r) ? r : Promise.resolve(r)`. Its callers see the same values; at most they gain one tick.
- `AnyToPromiseWithCtx` overrides `run()` as well as `call()`.

The alternative was to change `call()` to return a value. It was rejected: that is a breaking type change in `@tsed/core`, which every plugin depends on.

### D3. `PlatformHandler.onRequest()` and `flush()` return `void | Promise<void>`

- **`onRequest`:** `resolver.run(handler)`, then `onResponse()` either in the same tick or after the promise settles. The result of `onResponse()` is returned, so the promise from `PlatformExpressHandler` is still awaited.
- **`flush`:**
  - call `responseFilter.resolveBody()`;
  - set the body in the same tick when the result is a value;
  - otherwise chain on it;
  - errors go to `platformExceptions.catch()` on both paths, with try/catch for the sync path and a rejection handler for the async path.
- **`PlatformKoaHandler.onRequest`** returns `undefined` instead of `Promise.resolve()` when it skips the handler.

### D4. `PlatformResponseFilter.resolveBody()`; `transform()` stays async

- `resolveBody(data, $ctx): unknown | Promise<unknown>` does what `transform()` does today. Its path is synchronous when:
  - the endpoint has no view;
  - serialization runs through the built-in serializer;
  - the content-type filter (`resolved.transform`) returns a value.
- `transform()` becomes `async transform(data, $ctx) { return this.resolveBody(data, $ctx); }`.
- To keep subclasses working, `resolveBody()` delegates to `this.transform()` when a subclass overrides `transform`, `serialize` or `renderView`. The check runs once per instance, by comparing to `PlatformResponseFilter.prototype`. Overriders then keep today's async behaviour.
- `flush()` calls `resolveBody()`.

The alternative was to make `transform()` return a maybe-promise. It was rejected because `@tsed/sse` calls `.then()` on it.

### D5. Adapters chain handlers with the same rule: continue in the same tick, or wait for the promise

- **Fastify `compose`:** a loop runs `compiledHandler($ctx)` while each one returns a non-promise. At the first promise, it continues asynchronously from that index. When the loop finishes:
  - **Sync path:** an error is thrown, which goes to Fastify's error handler as today. If the reply has been sent, it returns `undefined`, so Fastify skips `wrapThenable`. If the reply has not been sent, it falls back to `Promise.resolve($ctx.response.raw)`, which is today's value.
  - **Async path:** it keeps today's return value.
- **Fastify `mapHandler`** (middlewares used through `.use`): it uses the same rule, `done()` in the same tick or after the promise.
- **Express `mapHandler`:**
  - `runInContext(req.$ctx, () => step())`, where `step` calls the handler inside try/catch;
  - if the result is a value, it sets `$ctx.error` and calls `callNext()` in the same tick;
  - otherwise it does that once the promise settles;
  - `catchAsyncError` is no longer used on this path.
- **Koa `mapHandler`:** the same step, then `return callNext(...)`. That returns Koa's `next()` promise, which Koa's compose requires. The `async` closure is removed. `useContext` stays async, because it must `await next()` and `finish()`.
- **Serverless:**
  - `createHandler` keeps an async function, because Lambda expects a promise;
  - it no longer `await`s the compiled handler, which `compileHandler` returns synchronously;
  - it uses `resolver.run()`, so a sync endpoint is classified without an extra tick.

The shared piece is the maybe-promise contract of `PlatformHandler`. Every adapter's wrapper follows the same rule: continue in the same tick on a value, wait on a promise. Each adapter still keeps its framework's own `next` or `done` semantics.

### D6. `runInContext()` returns the callback result as is

`runInContext()` was declared `async`, so it always returned a promise, even for a synchronous callback. This was found during implementation; the first version of this design assumed the opposite.

- `runInContext()` is no longer `async`: it returns `cb()`'s result as is, and a promise only when `cb` returns one or when a `$alterRunInContext` listener has to be awaited first. Its return type widens from `Promise<Result>` to `Result | Promise<Result>`, and an error thrown by a synchronous callback is thrown synchronously instead of being returned as a rejected promise.
- Every caller in the repository either `await`s it (`await` on a plain value works), returns it from an `async` function, or returns it to code that handles a value (`ensureContext`, the type-graphql middleware whose `next` is always async). `PulseService` returns it from a non-`async` function, but Pulse calls the processor with `await` inside a `try/catch`, so a value or an error thrown synchronously is handled like a promise.
- The `$alterRunInContext` path stays asynchronous. Its known listener is `@tsed/mikro-orm` (`MikroOrmModule.$alterRunInContext`, issue #1949), which runs each request inside a MikroORM `RequestContext` so every request gets its own forked `EntityManager`. The shared `requestPipeline` suite covers a listener returning an async wrapper on every platform.
- The browser build gets the same contract.
- Alternative considered: a new `callInContext()` next to an unchanged `runInContext()`. It was implemented first, then dropped: it doubles the API for the same behaviour, while the only cost of changing `runInContext()` is for code that chains `.then()`, `.catch()` or `.finally()` on its result without awaiting it (none in this repository).

## Risks / Trade-offs

- **[Fewer ticks change what code racing the request sees]**
  - Code that schedules a microtask in `$onRequest` or in a middleware, and expects the response not to be sent yet, may now see it sent.
  - Mitigation: run the suites of every platform and of `platform-log-request`, `platform-exceptions`, `platform-cache`, `platform-response-filter`, `sse`, `formio`, `passport`, `oidc-provider` and `config`. Add the D5 scenarios as integration tests on Express, Koa and Fastify with `PlatformTestSdk`. Compare any failure with the base branch first, as `.agents/lessons.md` asks.
- **[Third-party code that chains `.then()`, `.catch()` or `.finally()` on `runInContext()`, `PlatformHandler.onRequest()` or `flush()`, or expects a synchronous error as a rejection]**
  - Mitigation: note it in the release notes as a breaking change of `runInContext()` and a type change of `onRequest()`/`flush()`. `await` (with `try/catch`) keeps working. No such caller exists in this repository (checked with `git grep`).
- **[Subclass overrides of `PlatformResponseFilter`]**
  - Mitigation: D4 detects the override and keeps the async path for them.
- **[Fastify sync path returns `undefined` before the reply is sent]**
  - Fastify would then wait for a `reply.send()` that never comes.
  - Mitigation: return `undefined` only when the reply is already sent, and fall back to today's return value otherwise. Cover a handler that sends nothing (e.g. `@Res()` used later) with a test.
- **[Errors thrown synchronously now travel up the call stack]**
  - Before, they were caught inside an async function and turned into a rejection.
  - Mitigation: try/catch at each step on the sync path. The D5 "sync endpoint throws" scenario runs on every platform.
- **[More code paths to keep in sync]** Each step now has two branches.
  - Mitigation: one shared pattern (D1), with unit tests for both branches of `AnyToPromise.run`, `PlatformHandler.onRequest/flush` and `PlatformResponseFilter.resolveBody`.

## Migration Plan

No migration for applications. Ship in a minor release, with a release note on the widened return types of `PlatformHandler.onRequest()`/`flush()` and on the new `AnyToPromise.run()` / `PlatformResponseFilter.resolveBody()`. Rollback is a revert of the change: no data or configuration is involved.

## Open Questions

- Should `@tsed/core` export a public `MaybePromise<T>` type for the new signatures, or keep them as `T | Promise<T>` inline? This does not change the approach.
