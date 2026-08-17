## ADDED Requirements

### Requirement: A host bridge installs the shared Fetch handler

Each first-party platform integration SHALL host the shared Fetch handler rather than implement Ts.ED controller execution, parameter binding, response filtering, or exception mapping itself.

#### Scenario: Host a controller through an Express bridge

- **WHEN** an Express application is configured with the v9 bridge
- **THEN** an incoming Express request SHALL be converted at the bridge boundary and executed by the shared Fetch handler

#### Scenario: Host a controller through a direct Fetch bridge

- **WHEN** a Fetch-compatible runtime registers the v9 handler
- **THEN** the bridge SHALL forward the runtime request to the shared handler without a Node request/response conversion

### Requirement: A host bridge owns runtime conversion and lifecycle

A host bridge SHALL define request conversion, response streaming/finalization, native capability registration, and start/stop behavior for its host runtime.

#### Scenario: Stream a Fetch response through a Node host

- **WHEN** the shared handler returns a streaming Fetch response to a Node-based bridge
- **THEN** the bridge SHALL write the status and headers and stream the response body without eagerly buffering it

### Requirement: A host bridge preserves external integration hooks

A host bridge SHALL expose native request/response objects and `PlatformApplication` lifecycle hooks required by external middleware and Ts.ED integration packages without implementing those integrations itself.

#### Scenario: Process multipart through the platform-multer package

- **WHEN** `@tsed/platform-multer` is configured for a supported Node host
- **THEN** the bridge SHALL provide the native request and response objects required by that package without adding multer behavior to the Fetch core

#### Scenario: Attach Socket.IO during server lifecycle

- **WHEN** `@tsed/socketio` uses `PlatformApplication` after the host server is available
- **THEN** the bridge SHALL preserve the lifecycle and native server access required for Socket.IO attachment without adding Socket.IO or WebSocket handling to the Fetch core

### Requirement: A host bridge handles explicitly native Use middleware

Every first-party adapter package SHALL export its typed `native()` helper. A host bridge SHALL execute a `native(handler)` value registered through `UseBefore`, `Use`, or `UseAfter` only when it supports that middleware form and phase. It SHALL preserve the host's native middleware ordering semantics and SHALL reject unsupported native middleware values.

#### Scenario: Execute Express native middleware explicitly

- **WHEN** an Express application registers `UseBefore(native(handler))`
- **THEN** the Express bridge SHALL install the handler using Express-native middleware semantics before the shared Fetch handler for the matched route

#### Scenario: Reject native middleware in direct Fetch execution

- **WHEN** an application containing a `native(handler)` Use value runs through the direct Fetch entry point
- **THEN** execution SHALL fail with an actionable unsupported-host error

#### Scenario: Keep Fastify plugins outside Use decorators

- **WHEN** a Fastify plugin is configured
- **THEN** it SHALL be registered during Fastify bootstrap and SHALL NOT be treated as a `native()` Use middleware value

#### Scenario: Keep the portable continuation independent of Express

- **WHEN** an Express bridge hosts portable `Use*` middleware that awaits its continuation
- **THEN** it SHALL invoke the shared Fetch pipeline as one unit and SHALL NOT expose Express's non-awaitable `next` callback to that middleware

#### Scenario: Retain Koa await-next only at the native boundary

- **WHEN** an application registers `UseBefore(native(koaMiddleware))` and the Koa middleware awaits its native `next` callback
- **THEN** the Koa bridge SHALL preserve Koa's native onion semantics independently of the portable continuation

### Requirement: Global middleware configuration remains native-first

`Configuration.middlewares` SHALL continue to accept a function as native host middleware without requiring `native()`, and SHALL continue to resolve a class entry through the Ts.ED middleware contract. This change SHALL NOT add a `portable()` wrapper for global configuration functions.

#### Scenario: Register a native middleware globally without a wrapper

- **WHEN** an application configures `middlewares: [cors(), cookieParser()]`
- **THEN** the active host bridge SHALL register those functions through its native bootstrap hooks

#### Scenario: Access request scope from a global native middleware

- **WHEN** a global native middleware runs after the bridge has established a request scope
- **THEN** it MAY retrieve that scope through `context()` according to the active adapter's lifecycle semantics
