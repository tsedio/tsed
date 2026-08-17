## ADDED Requirements

### Requirement: Portable handlers receive a runtime-neutral HTTP context

The v9 HTTP core SHALL provide a request-scoped context containing the standard `Request`, matched route data, DI state, lifecycle state, and a response draft. The portable context SHALL NOT require Express-, Fastify-, Koa-, or Node-specific request or response APIs.

#### Scenario: Access route data through the portable context

- **WHEN** a decorated handler is invoked for a route with path and query parameters
- **THEN** the handler SHALL receive the matched values from the runtime-neutral context independent of the hosting runtime

### Requirement: Response mutation is finalized as one Fetch response

The response draft SHALL allow portable code to set status, headers, cookies, and body before finalization, and the core SHALL materialize one standard `Response` after the execution pipeline completes.

#### Scenario: Set headers and status before a controller result is finalized

- **WHEN** middleware or a controller updates the response draft and returns a body
- **THEN** the returned Fetch response SHALL contain the resulting status, headers, cookies, and body

### Requirement: Native runtime access is explicit and capability-based

`PlatformRequest` and `PlatformResponse` SHALL expose host-specific objects only through their typed `native` properties, supplied by the active host bridge. Their `raw` properties SHALL be aliases of those `native` properties and SHALL be documented as non-portable. The core SHALL NOT require a host to supply Node HTTP objects.

#### Scenario: Run without a native host capability

- **WHEN** the application runs through the direct Fetch handler without a Node capability
- **THEN** portable handlers SHALL execute normally and `request.native`, `response.native`, `request.raw`, and `response.raw` SHALL be unavailable

#### Scenario: Run with native host objects

- **WHEN** a host bridge attaches its native request and response objects for an invocation
- **THEN** `request.native` and `response.native` SHALL expose the host-specific objects and their respective `raw` properties SHALL reference the same objects

### Requirement: The HTTP context supports external integrations without implementing them

The v9 HTTP core SHALL provide request-scoped extension state, native request/response access, and application lifecycle hooks for integration packages. It SHALL NOT implement cookies, sessions, multipart, views, Socket.IO, or WebSocket/upgrades as core HTTP capabilities.

#### Scenario: Run middleware supplied by the host ecosystem

- **WHEN** a host middleware adds cookies or session data to the native request
- **THEN** an integration that explicitly uses the native request or request-scoped extension state SHALL be able to consume that data without `platform-http` parsing or managing the middleware

#### Scenario: Attach integration data to a request

- **WHEN** an integration package processes a request and stores parsed multipart or other request-scoped data through the extension mechanism
- **THEN** subsequent Ts.ED handlers in the same request scope SHALL be able to retrieve that data without coupling the HTTP core to the integration implementation

### Requirement: Use decorators default functions to portable middleware

`Use`, `UseBefore`, and `UseAfter` SHALL accept a portable function, a DI-resolved Ts.ED middleware class, or an explicit `native(handler)` value. The core SHALL use `isClass()` to classify a class input. Any function that is not wrapped by `native()` SHALL be a portable context handler; the core SHALL NOT classify it as native middleware by inspecting its arity. The portable execution contract SHALL call functions with a runtime-neutral context and a Ts.ED-owned continuation.

#### Scenario: Execute a function middleware as a portable context handler

- **WHEN** an application registers `UseBefore((ctx) => handler(ctx))`
- **THEN** the shared Fetch pipeline SHALL invoke it with the runtime-neutral context independently of the active host bridge

#### Scenario: Preserve a DI middleware class

- **WHEN** an application registers a middleware class through a `Use*` decorator
- **THEN** the core SHALL resolve it through DI and invoke its decorator-less `use(ctx, next)` method with the runtime-neutral context and continuation

#### Scenario: Retain legacy parameter-decorator middleware support

- **WHEN** a DI middleware class declares parameter decorators on its `use` method
- **THEN** v9 SHALL support the existing Ts.ED parameter-binding behavior; migrating the project to TC39 decorators is out of scope for this change

#### Scenario: Do not infer an unmarked native-style function

- **WHEN** an application registers an Express- or Koa-style callback without wrapping it in `native()`
- **THEN** v9 SHALL invoke it as a portable context handler and SHALL NOT infer native middleware semantics from its parameter count

### Requirement: Portable middleware continuation is Promise-first and implicit by default

The portable middleware pipeline SHALL supply a Ts.ED-owned, single-use `next(): Promise<void>` continuation to every portable function or class middleware. When a middleware resolves without calling `next()` and has not produced a response, the core SHALL advance the pipeline implicitly. When it calls and awaits `next()`, the core SHALL resume the middleware after downstream execution. `@Next()` SHALL NOT be part of the v9 portable middleware API.

#### Scenario: Advance implicitly after a simple middleware

- **WHEN** `UseBefore(async (ctx) => { await authenticate(ctx); })` resolves without producing a response
- **THEN** the core SHALL advance to the next pipeline stage

#### Scenario: Resume after downstream execution

- **WHEN** a portable middleware calls and awaits `next()`
- **THEN** it SHALL resume only after the downstream portable pipeline has completed

#### Scenario: Reject multiple continuation calls

- **WHEN** a portable middleware calls its continuation more than once
- **THEN** the core SHALL reject execution with a deterministic middleware-composition error

#### Scenario: Remove Next decorator injection

- **WHEN** a portable class middleware declares a `@Next()` parameter
- **THEN** v9 SHALL reject it with a migration error directing the author to the direct `use(ctx, next)` method signature
