# Proposal

## Why

On `GET /hello`, Ts.ED on Fastify still spends about 5.8 µs of CPU per request more than raw Fastify (23.4 against 17.6 µs/req, CPU profiles of tsedio/tsed#3523 after PR #3524). The largest share, about 2.5 µs/req, is the promise chain of the request pipeline. Every request awaits every handler, even when the endpoint, its middlewares and the response filter all return plain values. In raw Fastify, `reply.send` runs inside the route handler. In Ts.ED, it runs inside a microtask on 100% of the requests. The shared pipeline (`AnyToPromise`, `PlatformHandler`, `PlatformResponseFilter`) is the same on Express, Koa and serverless, so they pay the same chain.

## What Changes

- **`AnyToPromise.run()`** (new) returns the result object itself, not a promise, when the callback returns a plain value, a `Buffer`, a stream or an HTTP response object. It returns a promise for promises, observables and handlers that call `next`. `call()` keeps its signature and always returns a promise.
- **`runInContext()`** (`@tsed/di`) returns the callback result as is instead of always wrapping it in a promise. **BREAKING (types only)**: its return type widens from `Promise<Result>` to `Result | Promise<Result>`. Callers that `await` it are unaffected; code that calls `.then()` on its result must change.
- **`PlatformHandler.onRequest()` and `flush()`** return `undefined` when they finish synchronously, and a promise otherwise. **BREAKING (types only)**: their declared return type widens from `Promise<…>` to `Promise<…> | void`. Callers that `await` them are unaffected; code that calls `.then()` on them must change. Subclasses that override them and return a promise keep working.
- **`PlatformResponseFilter`** gets a method that returns either a value or a promise (`resolveBody()`), used by `PlatformHandler.flush()`. `transform()` keeps returning a promise for its current callers (`@tsed/sse`, `@tsed/formio`). A subclass that overrides `transform()` keeps being called through `transform()`.
- **`PlatformHandler.flush()`** sends the response in the same tick when the response filter returns a plain value.
- **Every adapter** chains handlers without a promise when the previous one finished synchronously:
  - Fastify: `compose`, plus a route handler that returns `undefined` once the reply is sent, so Fastify skips its thenable path.
  - Express: `mapHandler` calls `next()` in the same tick.
  - Koa: `mapHandler` drops the `async` closure and `catchAsyncError`. It still returns `next()`'s promise, as Koa requires.
  - Serverless: `PlatformServerlessHandler` skips the promise wrap of a synchronous result.
- The order of the observable effects (status, headers, `$ctx.data`, response filters, exception filters, `$onResponse`) stays the same. Only the number of microtask ticks between them changes, and only on the synchronous path.

Apart from the two `PlatformHandler` return types above, no public signature changes.

## Capabilities

### New Capabilities

- `platform-request-pipeline`: how a platform adapter runs the handlers of a route (middlewares, endpoint, response handler), when it may complete synchronously, and which ordering and error guarantees hold on every platform.

### Modified Capabilities

None. `http-benchmarks` already measures the gain, and its requirements do not change.

## Impact

- **Code:**
  - `@tsed/core` (`AnyToPromise`).
  - `@tsed/platform-http` (`PlatformHandler`, `AnyToPromiseWithCtx`).
  - `@tsed/platform-response-filter` (`PlatformResponseFilter`).
  - `@tsed/platform-express`, `@tsed/platform-koa` and `@tsed/platform-fastify` (`mapHandler`, `compose`), with `PlatformExpressHandler` and `PlatformKoaHandler`.
  - `@tsed/platform-serverless` (`PlatformServerlessHandler`).
- **APIs:**
  - New `AnyToPromise.run()` and `PlatformResponseFilter.resolveBody()`, both returning a value or a promise.
  - `PlatformHandler.onRequest()` and `flush()` may return `undefined` instead of a promise. Third-party code that calls `.then()` on them is the compatibility risk to review; none exists in this repository.
- **Behaviour:**
  - Fewer microtask ticks on synchronous routes, so `$ctx.isDone()`, `$ctx.data` and the response are ready earlier relative to unrelated microtasks.
  - The `.agents/lessons.md` rule "Keep the microtasks of an async API when optimizing it" applies. The suites of every platform and of the packages that hook into the pipeline (`platform-log-request`, `platform-exceptions`, `platform-cache`, `sse`, `formio`, `passport`, `oidc-provider`, `config`) must pass unchanged.
- **Performance target:** measurable with the benchmark workflow on `GET /hello` and `GET /users/:id`, on all three platforms, with no regression on `POST /orders` and `GET /orders?size=500`.
