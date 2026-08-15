## Why

Ts.ED currently offers platform adapters for Express, Koa, and Fastify, but applications built on Elysia cannot use the framework while retaining Ts.ED controllers, dependency injection, and HTTP abstractions. Adding a maintained Elysia adapter gives Bun and Fetch-native Elysia users a supported integration boundary.

## What Changes

- Add the `@tsed/platform-elysia` package with Elysia-specific platform, request, response, handler, and route-path adapters.
- Provide lifecycle, routing, response, error, static-file, and native callback behavior appropriate to Elysia's Fetch-native execution model.
- Add the Elysia capability matrix, focused adapter tests, public package metadata, and configuration documentation.
- Declare unsupported features explicitly in the test matrix and capability documentation.

## Capabilities

### New Capabilities

- `elysia-platform-adapter`: Run Ts.ED applications on Elysia through an explicit Fetch-native platform boundary.

### Modified Capabilities

- None.

## Impact

- Adds `packages/platform/platform-elysia` and its Elysia peer dependency.
- Updates the platform capability matrix and Elysia configuration/navigation documentation.
- Adds tests to the platform test suite and requires Bun/Elysia-compatible runtime coverage.
