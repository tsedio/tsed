## Why

Ts.ED's HTTP core exposes a platform abstraction whose public behavior still assumes Express/Node-style request and response objects. Every new runtime adapter must therefore reproduce framework-specific APIs while also integrating routing, request lifecycle, DI, errors, parsing, and response serialization. The growing Fetch runtime contract is now common enough to make a Fetch-native core the better foundation for Ts.ED v9.

## What Changes

- Introduce a Fetch-native HTTP execution contract: a Ts.ED application can be compiled to a standard `Request`-to-`Response` handler.
- **BREAKING** Replace the public platform request/response contract with a runtime-neutral request context and mutable response draft; framework-specific objects move to explicitly named native capabilities.
- **BREAKING** Redefine platform adapters as thin host bridges responsible for runtime conversion and server lifecycle, rather than as the place where Ts.ED request handling is implemented.
- Preserve Ts.ED's DI, decorators, validation, route metadata, exception handling, and response filtering in the shared HTTP core.
- Rebuild the existing Express, Fastify, and Koa integrations as first-party host bridges, with a conformance suite that makes future adapters straightforward to implement.
- Provide native-object and lifecycle extension points so external middleware and Ts.ED integration packages retain ownership of cookies, sessions, multipart, views, Socket.IO, and upgrades without becoming `platform-http` features.

## Capabilities

### New Capabilities

- `fetch-http-handler`: Compile a bootstrapped Ts.ED HTTP application to a standard Fetch handler while preserving Ts.ED lifecycle semantics.
- `runtime-neutral-http-context`: Provide the v9 request context, response draft, lifecycle contract, and explicit native runtime capabilities.
- `platform-host-bridge`: Define and validate minimal adapters that host the Fetch-native application on Node and Fetch runtimes.
- `platform-adapter-conformance`: Specify the shared conformance suite and mandatory behavior for every first-party host bridge.

### Modified Capabilities

- None.

## Impact

- Primary affected packages: `@tsed/platform-http`, `@tsed/platform-router`, `@tsed/platform-params`, `@tsed/platform-exceptions`, `@tsed/platform-response-filter`, the Express, Fastify, and Koa platform packages, plus compatibility integration points used by `@tsed/platform-multer` and `@tsed/socketio`.
- Public APIs centered on `PlatformRequest`, `PlatformResponse`, `PlatformContext`, `PlatformAdapter`, middleware execution, and bootstrap/callback factories will change for v9.
- Node hosting will retain a small Request/Response conversion boundary; Fetch runtimes can consume the generated handler directly.
- No dependency on `universal-middleware` is introduced. Its architecture is reference material only.
