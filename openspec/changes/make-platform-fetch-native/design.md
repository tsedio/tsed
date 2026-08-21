## Context

Ts.ED v8 compiles decorator metadata into handlers and delegates both handler invocation and route registration to `PlatformAdapter`. The request and response abstractions remain coupled to Node and Express-like methods, so each platform implementation owns transport conversion, lifecycle behavior, error propagation, routing details, and framework compatibility.

The v9 alpha branch deliberately permits API breaks. The objective is a small, portable HTTP core that can run directly in Fetch runtimes while retaining explicit escape hatches for Node and framework-specific facilities.

## Goals / Non-Goals

**Goals:**

- Make `Request -> Promise<Response>` the canonical public HTTP execution boundary.
- Keep DI, decorators, parameter binding, validation, error handling, response filtering, and route metadata in the shared core.
- Reduce a host adapter to transport conversion, native-capability registration, server lifecycle, and framework route installation.
- Provide explicit native-object, request-state, and lifecycle extension points without reimplementing third-party middleware or transports in the HTTP core.
- Establish one executable conformance suite for all first-party host bridges.

**Non-Goals:**

- Preserve v8 `PlatformRequest`, `PlatformResponse`, `PlatformContext`, or `PlatformAdapter` compatibility.
- Adopt `universal-middleware` as a dependency or mirror its public API.
- Implement cookies, sessions, multipart, template rendering, Socket.IO, WebSocket/upgrades, static assets, or server lifecycle as features of the HTTP core. These remain middleware, host features, or integration-package responsibilities.
- Implement Hono, Bun, Elysia, worker, or any other new platform bridge in this milestone. The existing Elysia branch is validation context for the architecture, not a delivery target of this change.

## Decisions

### 1. Evolve `@tsed/platform-http` in place

`@tsed/platform-http` remains the v9 home of the portable HTTP contract, `PlatformApplication`, host bridge contract, and direct Fetch testing utilities. It is the common base consumed by platform adapters and by integrations that retrieve `PlatformApplication` through DI; v9 will deliberately break its public API instead of adding a parallel `@tsed/http` package.

Creating a new package now would add a package and import migration to the Fetch-contract migration, split the public story for application bootstrap and testing, and create an artificial boundary while the new core still depends on Ts.ED DI, routing, schemas, and lifecycle. A future extraction is only justified if the Fetch engine becomes independently consumable without those Ts.ED facilities.

### 2. Use Fetch as the HTTP port, not as the full runtime abstraction

The shared route-execution boundary will be an explicit Fetch handler, conceptually `handle(request: Request, runtime?: RuntimeContext): Promise<Response>`. A small runtime context carries only portable execution data such as `waitUntil`; host-specific objects do not belong in it. The host bridge selects the Ts.ED route and supplies its compiled handlers before invoking this boundary.

This aligns with Hono, Bun, Elysia, workers, and modern Node while preserving an adapter boundary for hosts that do not natively speak Fetch. Continuing to model the shared core after Express-like `req`/`res` would retain the current coupling; replacing all runtime behavior with a generic server framework would move rather than remove the dependency.

### 3. Refactor the existing platform request/response facades around Fetch

The v9 execution context will retain `PlatformRequest` and `PlatformResponse` as the ergonomic Ts.ED facades. `PlatformRequest` is backed by an immutable standard `Request`; `PlatformResponse` owns mutable status, headers, cookie mutations, and body state until finalization produces one `Response`. No separate public `ResponseDraft` type is introduced.

This permits decorators and response filters to keep their current imperative ergonomics without pretending that a Fetch `Response` is mutable. Native host objects live symmetrically on the facades: `request.native`/`response.native`, with `request.raw === request.native` and `response.raw === response.native` as explicit non-portable aliases. The active bridge supplies their types and values; `platform-http` does not define a Node HTTP capability or require a Bun/Fetch host to emulate Node objects. Portable code uses the Fetch-backed facade; bridge-specific code uses the native properties.

### 4. Compile controller invocation and Ts.ED middleware once in the shared core

`PlatformHandler`, parameter compilation, exception conversion, response filtering, and middleware composition will target the new context. Host bridges must not reimplement this pipeline. Host frameworks retain route registration, matching, and path-parameter extraction; after selecting a route they invoke the shared compiled controller handler with the Fetch-backed context.

The alternative—routing every request through a third-party universal router—would duplicate Ts.ED route metadata and weaken integration with decorated controllers. The alternative—one adapter class per framework with full pipeline ownership—preserves the present maintenance cost.

### 5. Make `Use*` inputs explicit instead of inferring Express/Koa callbacks

The existing `Use`, `UseBefore`, and `UseAfter` decorators accept arbitrary values. Their route compilation currently infers a raw middleware function from its arity, which makes their behavior substantially Express-shaped and can accidentally treat a Ts.ED context function as a native callback. v9 will discriminate middleware inputs explicitly:

- a function with zero or one declared parameter is a portable Fetch middleware and receives the runtime-neutral `PlatformContext` only;
- a function with two or more declared parameters is native host middleware by compatibility; `native(handler)` remains the explicit form of that intent;
- a class (detected with `isClass()`) is a DI-resolved Ts.ED middleware. Its decorator-less `use(ctx: PlatformContext)` method is supported alongside the existing legacy parameter-decorator model; a TC39 decorator migration is not in scope for this refactor;
- `native(handler)` is an explicit host-middleware value, delegated only to a compatible active bridge.

`UseBefore(native(handler))`, `Use(native(handler))`, and `UseAfter(native(handler))` preserve native Express/Koa middleware escape hatches and their host ordering semantics. Every first-party adapter package SHALL export its typed `native()` helper. A bridge SHALL reject a native value it cannot support. Native registration remains unavailable to direct Fetch execution. Fastify plugins are deliberately outside this model: they remain bootstrap-time `register()` operations rather than `Use*` inputs.

Portable middleware follows a Promise-first, implicit-progression rule. The core exposes a Ts.ED-owned `ctx.next(): Promise<void>` continuation, but a middleware that resolves without calling it automatically advances to the next portable stage unless it has produced a response. A middleware calls and awaits `ctx.next()` only when it needs to resume after downstream processing; the continuation is single-use and never delegates to a host callback. This keeps `UseBefore((ctx) => {})` lightweight while allowing one middleware to act after a handler. The `@Next()` decorator is removed from the v9 portable contract.

The v9 contract uses function arity as a compatibility boundary: zero- or one-argument functions are portable, while functions with two or more parameters retain native host semantics. `native()` remains the preferred explicit marker for portable code that intentionally depends on a host. A host bridge invokes the portable Fetch chain as its own unit: Express, Koa, and Fastify continuations never enter portable middleware. A native handler instead retains its host semantics, including non-awaitable Express `next()` and Koa's `await next()`.

Global `Configuration.middlewares` has a different role: it configures host bootstrap hooks and is intentionally native-first. A function supplied there remains a native host middleware without requiring `native()`, and a class remains a DI-resolved Ts.ED middleware. No new `portable()` wrapper is introduced in this milestone. A native global middleware that needs the current Ts.ED request scope continues to use `context()` after the bridge has established it; this is an adapter-dependent escape hatch, not part of the portable Fetch middleware contract.

For a matched decorated route, the portable order is fixed: `UseBefore` → `Use` → interceptors → controller method → `UseAfter` → response filters → response finalization. Interceptors remain the closest cross-cutting layer around controller invocation; `UseBefore` and `UseAfter` run respectively before and after that intercepted method. Global native middleware runs in the adapter hook configured by `Configuration.middlewares`, outside this portable route sequence.

### Body ownership stays with the host

`platform-http` never consumes, parses, or caches a Fetch request body. JSON, text, URL-encoded form data, multipart data, and raw-body capture are all owned by the active host parser or middleware. `PlatformRequest.body`, `rawBody`, `files`, `cookies`, `session`, and route parameters delegate to optional host-provided accessors on every read; the core does not copy their values into request state.

Consequently direct Fetch execution exposes an untouched standard `Request` and returns `undefined` for host-only body capabilities. Express, Fastify, and Koa bridges expose values produced by their existing parsers/plugins through accessors. A bridge or integration that needs a raw body must capture it before its host parser consumes the stream. This retains each ecosystem's parser semantics and prevents `platform-http` from silently reading a single-use stream.

### 6. Define first-party bridges by capability, not inheritance complexity

First-party bridges will use a narrow `PlatformHostBridge` contract: create/register native capabilities, install the Fetch handler, convert a request and response when needed, and own start/stop behavior. Initial coverage is Express, Fastify, and Koa; direct Fetch execution is a core entry point used for testing rather than a separate platform package. Hono, Bun, Elysia, and worker bridges remain follow-up work after this contract has been proven against the existing platforms.

### 7. Keep non-Fetch integrations outside the HTTP core

The v9 core owns the Fetch request/response pipeline, `PlatformRequest.native`/`PlatformResponse.native`, host-supplied request accessors, and `PlatformApplication` lifecycle hooks. Cookies and sessions remain middleware supplied by each host ecosystem; multipart remains the responsibility of `@tsed/platform-multer`; Socket.IO and WebSocket server ownership remain the responsibility of `@tsed/socketio` and the host runtime.

This gives integration packages the native objects, host accessors, and lifecycle information they need without forcing a Fetch-only runtime to emulate Node- or framework-specific services. `platform-http` defines the access boundary, not implementations of multer, session middleware, Socket.IO, or a WebSocket transport.

### 8. Make conformance executable and transport-focused

A shared test suite will verify route matching, parameter/query extraction, request body use, status and headers, cookies, streaming, short-circuit middleware, error conversion, response finalization, and lifecycle cleanup. Each host bridge must run it, with explicit capability exclusions for unsupported host features.

## Risks / Trade-offs

- [Fetch request bodies are single-use streams] → `platform-http` does not parse, consume, or cache them. The active host bridge or an explicit body-parser middleware owns consumption and exposes its result through request accessors; raw-body access is an owned host capability.

Existing parameter decorators read the host-provided capability, while direct Fetch execution has no implicit parser and leaves the standard `Request` body untouched.

- [Node and Fetch stream semantics differ] → Test streaming and cancellation at the bridge boundary; keep conversion code isolated and avoid buffering by default.
- [Existing middleware relies on `req`, `res`, and `next`] → Make the break explicit in v9, provide native host middleware registration, and consider a separately versioned compatibility package after the new core is stable.
- [Koa/Express/Fastify provide non-portable sessions, views, and multipart] → Preserve native access and host accessors so existing middleware and integration packages retain ownership; do not claim Fetch parity for them.
- [Large cross-package refactor can regress behavior] → Land the shared conformance suite before converting production bridges and migrate one bridge at a time.
- [Public API naming is still open] → Keep this proposal behavioral; validate exact export names in the first design task before publishing alpha APIs.

## Node HTTP Impact Inventory

The v9 refactor SHALL classify every production import of `node:http` or `node:https` before implementation. The initial inventory is:

| Package                  | Direct production files | Classification                    | v9 disposition                                                                                                                                                     |
| ------------------------ | ----------------------: | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@tsed/platform-http`    |                       7 | **Must become runtime-agnostic**  | Extract Node server creation, Node callback types, and request/response decorator compatibility from the portable pipeline into bridges or Node-only entry points. |
| `@tsed/platform-cache`   |                       1 | **Review for agnostic migration** | Replace `IncomingMessage`/`ServerResponse` coupling with the Fetch context or document an explicit Node-only cache integration if no portable behavior exists.     |
| `@tsed/platform-express` |          1 runtime file | **Node bridge**                   | Keep Node imports at the Express bridge boundary; do not re-export them through the portable core.                                                                 |
| `@tsed/platform-fastify` |                       1 | **Node bridge**                   | Keep Node imports at the Fastify bridge boundary; do not re-export them through the portable core.                                                                 |
| `@tsed/platform-multer`  |                       1 | **Node host integration**         | Keep the Fastify multer adapter Node-specific; do not make multipart a Fetch-core capability.                                                                      |
| `@tsed/apollo`           |                       1 | **Node-specific integration**     | Investigate a runtime-neutral transport; otherwise document Node.js-only support in the capabilities matrix.                                                       |
| `@tsed/graphql-ws`       |                       1 | **Node-specific integration**     | Investigate a runtime-neutral WebSocket transport; otherwise document Node.js-only support in the capabilities matrix.                                             |
| `@tsed/socketio`         |                       1 | **Node-specific integration**     | Retain its native server lifecycle integration and document Node.js-only support.                                                                                  |
| `@tsed/terminus`         |                       1 | **Node-specific integration**     | Investigate a portable shutdown/health contract; otherwise document Node.js-only support.                                                                          |
| `@tsed/vike`             |        1 type-only file | **Review for agnostic migration** | Replace `IncomingHttpHeaders` with Fetch `Headers` or a local portable type where behavior permits.                                                                |

`@tsed/platform-koa` has no direct production `node:http` or `node:https` import; its Node behavior remains isolated behind Koa. Test-only imports are not release blockers but SHALL be updated after their owning production contract is classified. This inventory intentionally does not make `@tsed/platform-multer` or `@tsed/socketio` part of the portable core: their native integration boundaries are covered separately.

## Migration Plan

1. Keep the alpha branch based on `beta` and introduce v9 contracts alongside a focused test harness.
2. Convert the shared HTTP execution pipeline and make direct Fetch execution pass conformance tests.
3. Implement Node/Express, Fastify, and Koa bridges against the same handler; preserve the `PlatformApplication` lifecycle and native access required by `@tsed/platform-multer` and `@tsed/socketio`; remove v8 platform facades and adapter inheritance once no longer used.
4. Release from the `alpha` branch through the existing semantic-release workflow. Every commit that changes a public v9 API SHALL use a Conventional Commit footer of the form `BREAKING CHANGE: <description>` so semantic-release determines the major-version impact. Publish alpha documentation with an explicit migration guide and capability matrix. No rollback or mixed v8/v9 API mode is promised inside the v9 branch; production users remain on v8/beta until adoption.

## Breaking-change and migration documentation contract

Every public v9 break SHALL be recorded as it lands, not reconstructed at release time. The change register SHALL identify the affected package/export or decorator, the v8 behavior, the v9 behavior, the migration action, the validating test or example, and the breaking commit/PR reference. Each entry must map to a dedicated section of `docs/introduction/migrate-from-v8.md` before the alpha release is declared ready.

The migration guide SHALL follow the useful structure of `migrate-from-v7.md`: an up-front preparation checklist, a topic table linked to dedicated sections, and before/after examples for every breaking change. Its initial sections SHALL cover the Fetch handler and `PlatformRequest`/`PlatformResponse` facade refactor, adapter/bootstrap contract changes, portable versus `native()` `Use*` middleware, Promise-first continuation and `@Next()` removal, Node-specific integration capabilities, and any final public API breaks found during implementation. An undocumented breaking change blocks release readiness.

## Open Questions

- None at this time.
