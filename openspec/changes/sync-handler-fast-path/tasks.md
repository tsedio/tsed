# Tasks

## 1. Baseline

- [x] 1.1 Branch `perf/sync-handler-fast-path` from `perf/platform-fastify-hot-path` (PR #3524 is not merged yet: this change builds on its `compileHandler` sync path and callback hooks, and is rebased on `production` once #3524 lands). Verify: `git log` contains the #3524 commits.
- [x] 1.2 Add the integration tests for the `platform-request-pipeline` scenarios to the shared platform test suite (`packages/platform/platform-test-sdk`), so Express, Koa and Fastify run the same cases. The cases are: sync endpoint, sync middleware then async endpoint, `@Next()` middleware, async factory controller, `@Returns(201)` with `@Header` and a response filter, `@Redirect`, a sync endpoint throwing `BadRequest` with a `@Catch` filter, and a throwing response filter. Verify: the new cases pass on the base branch on the three platforms, before any change.
  - Note: the async-factory controller case is covered by the `PlatformParams.compileHandler` unit test ("async factory"); a controller is built at bootstrap, so the async instance path cannot be reached through an HTTP request in the shared suite. The suite is `requestPipeline` in `platform-test-sdk`, run by Express, Koa and Fastify.
- [x] 1.3 Record the base numbers: CPU profile of `GET /hello` on Fastify, Express and Koa (`.agents/skills/optimize-package-performance`) and one local bench run per platform with `--rounds 3`. Verify: numbers noted in the change notes for the PR description.
  - Base (CPU profile, GET /hello, busy µs/req): Fastify raw 17.6, Fastify Ts.ED 23.4 (send 100% in a microtask), Express Ts.ED 27.0, Koa Ts.ED 23.2.

## 2. `@tsed/core`: `AnyToPromise.run()`

- [x] 2.1 Make `#promise` lazy and add `run(cb)` returning `AnyPromiseResult | Promise<AnyPromiseResult>` (D2). Rewrite `call()` on top of it, keeping `Promise<AnyPromiseResult>`. Verify: existing `AnyToPromise.spec.ts` passes unchanged.
- [x] 2.2 Unit tests for `run()`. Each of these must return a value, not a promise: plain value, `undefined` without `next`, `Buffer`, stream, response object, canceled response. Each of these must return a promise: a promise, an observable, a rejected promise, `next()` called later, `next(error)`. Verify: `cd packages/core && npx vitest run src/utils/AnyToPromise.spec.ts`.
- [x] 2.3 Override `run()` in `AnyToPromiseWithCtx` (platform-http), with a unit test for the canceled-response case. Verify: `cd packages/platform/platform-http && npx vitest run src/common/domain`.

- [x] 2.4 Add `callInContext()` to `@tsed/di` (node and browser builds), returning the callback's result as is (D6). Unit tests: sync value returned without a promise, promise returned as is, `$alterRunInContext` listener awaited, existing context reused. Verify: `cd packages/di && npx vitest run src/node/utils/asyncHookContext.spec.ts`.

## 3. `@tsed/platform-response-filter`: `resolveBody()`

- [x] 3.1 Add `resolveBody(data, $ctx)`, which returns a value or a promise (D4). Make `transform()` delegate to it, and add the once-per-instance override detection for `transform`, `serialize` and `renderView`. Verify: existing `PlatformResponseFilter.spec.ts` passes unchanged.
- [x] 3.2 Unit tests for `resolveBody()`:
  - a value for a JSON endpoint and for a string with `text/plain`;
  - a promise for a view, and for an async content-type `@ResponseFilter`;
  - a subclass overriding `serialize()` is still called;
  - `transform()` still returns a promise.
    Verify: package tests.
- [x] 3.3 Run the suites of the `transform()` callers. Verify: `packages/third-parties/sse` and `packages/third-parties/formio` tests pass.

## 4. `@tsed/platform-http`: `PlatformHandler`

- [x] 4.1 Make `onRequest()` and `flush()` return `void | Promise<void>` (D3), with try/catch on the sync path and a rejection handler on the async one. Verify: `PlatformHandler.spec.ts` passes.
- [x] 4.2 Unit tests for both paths of `onRequest()` and `flush()`:
  - a sync handler sets `$ctx.data` and the headers before `onRequest()` returns;
  - an async handler sets them after the promise settles;
  - a sync throw and an async rejection both reach `platformExceptions.catch`;
  - a response filter returning a promise is awaited.
    Verify: package tests.
- [x] 4.3 Update `PlatformKoaHandler.onRequest` (return `undefined` instead of `Promise.resolve()`), `PlatformKoaHandler.flush` and `PlatformExpressHandler.onResponse` to the new contract. Verify: `platform-koa` and `platform-express` unit tests pass.
- [x] 4.4 Run the suites of the packages that hook into the pipeline, and compare any failure with the base branch under the same setup before treating it as a regression. The packages are: `platform-http`, `platform-exceptions`, `platform-response-filter`, `platform-log-request`, `platform-cache`, `platform-middlewares`, `platform-params`, `platform-multer`, `platform-views`, `security/passport`, `security/oidc-provider`, `config/core`. Verify: all pass.
  - Result: all pass. `security/passport` failed 2 tests once out of 5 runs (right after a batch of suites) and passed the 4 reruns; to watch on CI.

## 5. Adapters

- [x] 5.1 Fastify `compose`: sync loop, then the async continuation from the first promise. Return `undefined` only when the reply is already sent, otherwise today's value (D5). Fastify `mapHandler` gets the same rule. Add an integration test for a handler that does not send (`@Res()` sending later). Verify: `platform-fastify` tests, plus the task 1.2 cases.
  - Note: a handler returning `@Res()` and sending later already hangs on the base branch (verified), so the "reply not sent yet" case is covered with a global `onSend` hook that defers one route (`test/sync-route.spec.ts`).
- [x] 5.2 Express `mapHandler` (normal and error middleware): sync step with try/catch and `callNext` in the same tick, without `catchAsyncError` on the sync path. Verify: `platform-express` tests, plus the task 1.2 cases.
- [x] 5.3 Koa `mapHandler`: remove the `async` closure, and return `callNext`'s `next()` promise. Verify: `platform-koa` tests, plus the task 1.2 cases, including a downstream Koa middleware that runs after `await next()`.
  - Note: Express and Koa `useContext` also skip `$ctx.start()` when no `$onRequest` listener exists, as Fastify does since PR #3524. The Koa "after `await next()`" case is `useContext` itself (404 check), covered by the existing custom 404 tests.
- [x] 5.4 Serverless `createHandler`: use `resolver.run()` and stop `await`ing the compiled handler. Verify: `platform-serverless` tests (`$onRequest` / `$onResponse` error cases included).
- [x] 5.5 Add a test per adapter that a sync route sends in the same tick:
  - Fastify: the route handler returns `undefined` and the reply is sent;
  - Express: `res.headersSent` is true right after the Ts.ED route handlers return.
    Verify: package tests.

## 6. Verification and measurement

- [x] 6.1 Run `yarn test:lint`, `tsc --build` for every changed package and `yarn api:build` (new public methods need TSDoc). Verify: all pass.
- [x] 6.2 Repeat the task 1.3 CPU profiles. Verify: on Fastify `GET /hello`, `send` runs synchronously and `runMicrotasks` drops close to raw Fastify, about 0.8 µs/req. Write down the µs/req gained per platform.
  - After (CPU profile, GET /hello, busy µs/req, same method as 1.3): Fastify raw 15.1, Fastify Ts.ED 17.5 (1.16× raw, was 1.33×), microtasks 0.8 µs/req (raw: 0.8), send 100% synchronous; Express 23.2 (was 27.0, microtasks 20.5 → 0.9); Koa 23.1 (was 23.2: Koa's own compose keeps the promise chain).
- [ ] 6.3 Open the PR and add the `benchmark` label. Verify: the benchmark workflow shows lower CPU per request on `GET /hello` and `GET /users/:id`, and no significant regression on any route of any platform. Put its numbers in the PR description.

## Workflow follow-up

- After merge: sync the `platform-request-pipeline` spec (`openspec-sync-specs`) and archive the change (`openspec-archive-change`).
- Release note: widened return types of `PlatformHandler.onRequest()` / `flush()`, new `AnyToPromise.run()` and `PlatformResponseFilter.resolveBody()`.
