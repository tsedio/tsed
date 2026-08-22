## 1. v9 HTTP contract and package boundary

- [ ] 1.1 Refactor `@tsed/platform-http` in place as the v9 home of the Fetch handler, runtime context, `PlatformResponse`, `PlatformApplication`, host bridge contract, capability tokens, and testing exports.
- [ ] 1.2 Remove the v8 platform request/response and adapter inheritance assumptions from `@tsed/platform-http`, including obsolete public exports and configuration types.
- [x] 1.3 Define request-scoped host accessors and `PlatformApplication` lifecycle contracts for external middleware and integration packages without implementing their behavior in `platform-http`.
- [x] 1.4 Add typed `native` properties to `PlatformRequest` and `PlatformResponse`, preserve `raw` as a same-reference non-portable alias, and connect host-native objects to those facades.
- [x] 1.5 Add unit/type tests for the public v9 HTTP contract, host-accessor isolation, native aliases, and lifecycle integration behavior.
- [x] 1.6 Re-audit all production `node:http` and `node:https` imports, maintain the Node HTTP impact inventory, and classify each affected package as agnostic migration work, Node bridge, or Node-specific integration.

## 2. Shared Fetch-native execution pipeline

- [ ] 2.1 Implement request-scoped runtime-neutral context construction from a standard `Request`, including DI scope creation, request identifiers, route metadata, and lifecycle state.
- [ ] 2.2 Implement the `PlatformResponse` state and finalization path for status, headers, cookies, empty responses, serialized values, and streams.
- [ ] 2.3 Refactor parameter binding, decorated controller invocation, response filtering, and exception mapping to run against the shared context.
- [x] 2.4 Define and implement the portable middleware contract: a zero- or one-argument function defaults to a `PlatformContext` handler, while a function with two or more parameters retains native host compatibility; a class input (`isClass()`) resolves through DI and supports both decorator-less `use(ctx)` and existing legacy parameter decorators, and `native()` explicitly selects host middleware. Provide the Ts.ED-owned, single-use `ctx.next(): Promise<void>` continuation with implicit progression when it is not called; remove `@Next()` from the portable API. Test the fixed route order `UseBefore` → `Use` → interceptors → controller → `UseAfter` → response filters → finalization, plus short-circuit responses, downstream resumption, double-next rejection, error propagation, and parameter-decorator support excluding `@Next()`.
- [x] 2.5 Expose the route-level `Request -> Promise<Response>` factory and cover compiled controller execution, parameters, exceptions, filters, and lifecycle hooks with direct Fetch tests. Do not implement route matching or not-found behavior in `platform-http`.

## 3. Route compilation and body capabilities

- [ ] 3.1 Refactor route compilation so it emits shared controller-invocation handlers and route metadata; each host framework remains responsible for route registration, matching, and path parameters.
- [x] 3.2 Define body ownership and parsed-body caching semantics for JSON, text, form data, and raw bodies in the portable context.
- [ ] 3.3 Remove assumptions about cookies, sessions, multipart, views, Socket.IO, and upgrades from the portable request/response API while preserving native access and host accessors for their owning middleware and packages.
- [x] 3.4 Define and test the `@tsed/platform-multer` migration boundary for Express, Fastify, and Koa without adding multer implementation to `platform-http`.
- [x] 3.5 Add regression tests for body consumption, raw-body access, redirects, cookies/session middleware interop, and streaming response finalization.

## 4. Host bridge foundation and Node/Express bridge

- [ ] 4.1 Implement the `PlatformHostBridge` contract, bridge registration/bootstrap integration, shared request/response conversion utilities, and `PlatformApplication` native-server lifecycle access.
- [x] 4.2 Implement the direct Fetch bridge with portable runtime-context support and no Node conversion.
- [ ] 4.3 Implement the Node HTTP conversion boundary used by the Express, Fastify, and Koa bridges, including request URL/headers/body conversion, response streaming, cancellation, and native-object attachment without adding a Node capability to the portable core.
- [ ] 4.4 Rebuild the Express integration as a thin host bridge; export typed `native()` registration for the `UseBefore`/`Use`/`UseAfter` phases; preserve native-first `Configuration.middlewares` bootstrap hooks and `context()` access from those middleware once a request scope exists.
- [ ] 4.5 Add Express integration tests for controller execution, error handling, headers/cookies, native capabilities, portable middleware, and streaming.

## 5. Fastify and Koa host bridges

- [ ] 5.1 Rebuild the Fastify integration as a thin bridge, define its route-installation strategy, and register Fastify request/reply capabilities.
- [ ] 5.2 Define Fastify raw-body and native middleware integration as explicit capabilities rather than portable middleware behavior.
- [ ] 5.3 Add Fastify integration tests for direct routes, global/native middleware ordering, early responses, errors, raw body, and streaming.
- [ ] 5.4 Rebuild the Koa integration as a thin bridge and register Koa context/request/response capabilities.
- [ ] 5.5 Add Koa integration tests for controller execution, error handling, portable and `native()` middleware composition, native capabilities, and response finalization.

## 6. Adapter conformance and documentation

- [ ] 6.1 Build the shared representative application and adapter conformance suite for routing, parameters, headers, cookies, filters, errors, lifecycle cleanup, and capability absence.
- [ ] 6.2 Add stream completion and cancellation conformance cases, with explicit opt-outs only for bridges that do not advertise stream support.
- [ ] 6.3 Run the conformance suite for direct Fetch, Express, Fastify, and Koa; publish the resulting capability matrix in package documentation.
- [ ] 6.4 Add focused integration regression coverage proving that `@tsed/platform-multer` and `@tsed/socketio` retain their respective native request/response and server-lifecycle boundaries without becoming `platform-http` features.
- [ ] 6.5 Resolve the Node HTTP inventory: migrate `platform-http`, `platform-cache`, and `vike` where portable behavior is viable; keep Node imports isolated in the Express, Fastify, and Koa bridges; evaluate Apollo, GraphQL WS, Socket.IO, and Terminus for a portable alternative.
- [x] 6.6 Update `docs/introduction/capabilities.md` to identify integrations that remain Node.js-specific and their supported runtimes.

## 7. v9 alpha release readiness

- [ ] 7.1 Configure and verify the `alpha` branch semantic-release channel for v9 package publishing; require a `BREAKING CHANGE:` Conventional Commit footer for every public API break.
- [ ] 7.2 Maintain a v9 breaking-change register throughout implementation. For every public break, record affected package/export or decorator, v8 behavior, v9 behavior, concrete migration action, validating test/example, and breaking commit/PR reference; block alpha readiness on unresolved entries.
- [ ] 7.3 Publish `docs/introduction/migrate-from-v8.md`, modeled on `migrate-from-v7.md`: preparation checklist, linked topic table, and a dedicated before/after migration section for every register entry. Cover the Fetch facades, adapter/bootstrap contract, `Use*`/`native()` middleware, Promise-first continuation and `@Next()` removal, Node-specific capabilities, and all later breaks.
- [ ] 7.4 Update platform documentation and examples to use the Fetch handler and first-party host bridges.
- [ ] 7.5 Run focused package tests, the platform suite, type checks, linting, API documentation generation, and build validation before an alpha release.
