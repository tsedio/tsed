## Context

Elysia is optimized for Bun but is built around Web-standard `Request` and `Response` values. Ts.ED's current platform adapters assume mutable Node response objects or framework context wrappers, so this integration needs a dedicated Fetch-native boundary rather than an Express-compatible shim.

## Goals / Non-Goals

**Goals:**

- Provide a public `@tsed/platform-elysia` adapter that translates Ts.ED layers and HTTP abstractions to Elysia.
- Preserve Elysia's return-value and error lifecycle while making Ts.ED request-scoped DI available to every mapped handler.
- Document and test the supported capability surface.

**Non-Goals:**

- Do not emulate a mutable Node `ServerResponse`, promise generic Node or serverless callback support, or reimplement Elysia plugins.
- Do not support WebSocket routes, Elysia macro/type-provider features, or view rendering in the first adapter release.

## Decisions

- Use Elysia's Fetch-native handler contract. The adapter will construct a `PlatformContext` from Elysia's request/context objects and return native response values instead of relying on Connect `next(error)` semantics.
- Model the adapter after Fastify for layer registration, but retain a distinct request and response implementation because Elysia owns response construction through its context `set` object.
- Keep `elysia` as a peer dependency and a pinned development dependency. Elysia's native runtime entry point is the supported integration test boundary; Node listener/serverless compatibility is explicitly out of scope.
- Translate Ts.ED route syntax in an Elysia-specific `convertPath()` utility and test optional, regexp, and wildcard parameter paths before route registration.
- Use Elysia-native `FormData` and `File` values for multipart bodies. Do not emulate Multer middleware or storage engines; document Multer decorators as unsupported. Static files continue to require Elysia's documented static plugin; views, sessions, and deep query parsing remain unsupported.

## Risks / Trade-offs

- [Response API mismatch] Ts.ED response mutation may not map one-to-one to Fetch responses → centralize status, headers, cookies, and body conversion in `PlatformElysiaResponse` and add focused tests.
- [Runtime portability] Elysia behavior varies between Bun and Node compatibility modes → define Bun/Elysia as the supported runtime and avoid untested callback claims.
- [Routing syntax differences] Ts.ED parameter syntax can register incorrectly in Elysia → isolate conversion and cover representative route shapes.
- [Plugin lifecycle] static and multipart plugins may need registration before route compilation → document the initial plugin requirements and only enable tested features.

## Migration Plan

1. Publish the adapter as an additive package with peer dependency instructions.
2. Users opt in by installing `@tsed/platform-elysia` and `elysia`, then selecting `PlatformElysia` in bootstrap settings.
3. Rollback is removal of the opt-in package and restoration of the previous platform adapter; no persisted state or API migration is required.

## Open Questions

- Confirm the exact Elysia major/minor version and its Node compatibility behavior when pinning the test dependency.
- Confirm whether static assets can be covered without making an Elysia plugin a runtime dependency of every adapter consumer.
