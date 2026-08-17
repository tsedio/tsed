---
name: create-platform-adapter
description: Create a production-ready Ts.ED platform adapter for a new HTTP framework or runtime, such as Hono, Elysia, Bun.serve, or a Node framework. Use when adding an @tsed/platform-* package, porting controller and middleware support to another server framework, or assessing whether a framework can satisfy Ts.ED's platform contract.
---

# Create Ts.ED Platform Adapter

Build the adapter around Ts.ED's HTTP abstractions, not by copying an existing implementation wholesale. Preserve the target framework's lifecycle and native request/response model.

Read [the adapter reference](references/adapter-reference.md) before designing or implementing. It summarizes the repository's Express, Koa, and Fastify patterns and the `PlatformAdapter` contract.

## 1. Establish feasibility and scope

1. Confirm the target runtime can support Ts.ED routing, async middleware, status/headers/cookies, streams or equivalent bodies, error propagation, and a testable HTTP entry point.
2. Identify whether it is Node `IncomingMessage`/`ServerResponse` compatible. For Fetch-native runtimes, explicitly design the bridge instead of pretending Node response mutation works.
3. Record framework-version support, required plugins, and unsupported Ts.ED features. Do not silently omit multipart uploads, static assets, or serverless callback support.
4. Do not start or apply an OpenSpec workflow from this skill. The workflow below is the source of truth for the adapter implementation.

## 2. Inspect local precedents

Read these sources before creating files:

- `packages/platform/platform-http/src/common/services/PlatformAdapter.ts`
- `packages/platform/platform-express/src/components/PlatformExpress.ts`
- `packages/platform/platform-koa/src/components/PlatformKoa.ts`
- `packages/platform/platform-fastify/src/components/PlatformFastify.ts`
- Each package's `src/services/`, `src/utils/convertPath.ts`, `src/index.ts`, package manifest, Vitest config, and focused specs.
- `packages/platform/platform-express/test/platform-express.spec.ts`, `packages/platform/platform-koa/test/platform-koa.spec.ts`, and `packages/platform/platform-fastify/test/platform-fastify.spec.ts`.
- `docs/introduction/capabilities.md`, `docs/docs/configuration/{express,koa,fastify}.md`, `docs/docs/configuration/index.md`, `docs/index.md`, and `docs/.vitepress/config.mts`.

Choose the closest precedent by execution model: Express for Connect-style middleware, Koa for composed async middleware, Fastify for plugin/route-registration APIs. Reuse intent and coverage, not framework-specific calls.

## 3. Create the package

Create `packages/platform/platform-<framework>/` using a comparable package as a structural template. Adapt, do not blindly duplicate:

- `package.json`: ESM exports, build/test/barrel scripts, framework peer dependency, Ts.ED peer dependencies, and only runtime dependencies required by the adapter.
- `tsconfig.esm.json`, `vitest.config.mts`, `.npmignore`, and package `readme.md`.
- `src/index.ts`: export only the supported public adapter class, settings, decorators, and helpers.
- `test/app/`: a minimal server, framework-plugin setup, and shared integration fixtures compatible with `PlatformTestSdk`.
- `test/platform-<framework>.spec.ts`: the explicit `@tsed/platform-test-sdk` integration capability matrix. This file is mandatory for every new platform; a route-conversion or unit-only test suite is not a substitute.

Keep the framework itself a peer dependency; put it in `devDependencies` at a pinned test version. The workspace glob already discovers `packages/platform/*`; only update other package catalogues if a real registry, docs, or release surface needs the entry.

For `vitest.config.mts`, use the workspace preset import with this explicit type-resolution exception:

```typescript
// @ts-ignore
import {presets} from "@tsed/vitest/presets";
```

Add the new public package alias to both `tsconfig.node.json` and `tsconfig.spec.json`. For Fetch-native platforms with native `FormData` parsing, prefer that API in the platform package and document Multer decorators and storage engines as unsupported; do not create a `@tsed/platform-multer/<framework>` alias unless the Multer middleware contract is proven compatible.

## 4. Implement the adaptations

Create `Platform<Framework> extends PlatformAdapter<App>` with:

1. `NAME`, static `create()` and `bootstrap()` through `PlatformBuilder`.
2. `createApp()` returning the framework app and a valid request callback. If the framework cannot yield a Node callback, implement and document the appropriate server/runtime boundary.
3. `useContext()` that creates a `PlatformContext`, awaits `$ctx.start()`, makes it available to mapped handlers, and reliably calls `$ctx.finish()` when the response completes.
4. `mapLayers()` translating `PlatformLayer` methods, paths, wildcard parameters, statics, and handler ordering to the framework router.
5. `mapHandler()` that runs in the Ts.ED DI context, captures async errors, and preserves error-middleware and response-function semantics.
6. `bodyParser()`, `statics()`, server/listening hooks, and framework-specific lifecycle hooks where the base contract requires them.
7. `adapter()` bindings for the framework-specific `PlatformRequest`, `PlatformResponse`, and `PlatformHandler` implementations.

Do not expose a framework's raw request/response directly to controllers without adapters. Map all semantics needed by `PlatformRequest` and `PlatformResponse`: URL and query, params, protocol and host, cookies/session, status, headers, redirect, body serialization, file/download, stream, and completion state.

## 5. Handle framework boundaries explicitly

- Convert Ts.ED route syntax with a framework-specific `convertPath()` and test named, optional, regexp, and wildcard paths.
- Preserve the framework's error path. Do not call a Connect `next(error)` from a Koa/Fastify/Fetch handler unless the target framework actually supports it.
- Route errors through `PlatformExceptions.catch(error, $ctx)` and route unknown paths through `PlatformExceptions.resourceNotFound($ctx)`. Reuse the existing exception filters; do not handcraft framework-specific error or 404 response payloads.
- Register body parsing, multipart support, static serving, view rendering, and raw-body capture only when supported. Make plugin registration awaitable when required. Match `PlatformBuilder`'s global `rawBody` policy: capture the raw buffer only when `rawBody` is configured or `@RawBodyParams()` is detected, while preserving the framework-parsed `body`. For Fetch-native runtimes, capture it before parsing with `request.clone()` only when `request.body` exists; do not globally disable parsing with a per-route `parse: "none"` strategy. Fall back to `body` when no raw capture is active.
- Make HTTP/HTTPS creation and `listen()` match the framework's ownership model. Confirm the callback works with `serverless-http`-style consumers if the adapter claims serverless support.
- Keep framework module augmentation and Ts.ED global declarations narrow and public.

## 6. Build and run the integration matrix

After the package and platform adaptations exist, add focused unit tests and create `test/platform-<framework>.spec.ts` with `PlatformTestSdk.create({rootDir, adapter, server})`. Build the spec from the Express, Koa, and Fastify precedents, then run it before documenting the platform as supported.

- Use Express and Koa as the implementation baseline.
- Use Fastify only to understand framework-specific integration differences; do not copy its skips as an escape hatch.
- Add the `test/app/` fixtures needed by the SDK instead of omitting a scenario.

The following SDK groups are mandatory for every new platform. Keep them enabled, make them pass, and do not wrap them in `describe.skip`:

- `handlers`, `childrenControllers`, `inheritanceController`, `response`, `stream`, `middlewares`, `scopeRequest`, `headers`, `acceptMime`, `headerParams`, `pathParams`, `queryParams`, `bodyParams`, `cookies`, `session`, `location`, `redirect`, `errors`, `responseFilter`, `routing`, `locals`, `auth`, `module`, and `cache`.
- `view`, `statics`, `deepQueryParams`, and `custom404`.

For Fetch-native platforms, test multipart independently with native `FormData` and `File` body parameters. Do not add the SDK Multer suite when Multer's middleware contract is incompatible; document that Multer decorators and storage engines are unavailable.

Iterate on the adapter until the mandatory suite passes. Tackle isolated SDK gaps first (for example custom 404, deep query parsing, framework plugins, and test fixtures). Defer structural Fetch-native response work—stream bridging, response finalization, and Node callback emulation—until those simpler gaps are resolved. Then add coverage for adapter-specific behavior not supplied by the SDK, including bootstrap/create, native callback behavior, route conversion, error propagation, raw body, native multipart, and runtime/server lifecycle.

Update all public documentation in the same change:

1. Add the framework column and supported/unsupported states to both feature and plugin tables in `docs/introduction/capabilities.md`; explain limitations below the tables when a marker needs context.
2. Create `docs/docs/configuration/<framework>.md`, modeled on the closest adapter page. Cover installation, framework settings/plugins, static files, and use of a custom application instance.
3. Link the new page from `docs/docs/configuration/index.md` and add it to the Configuration sidebar in `docs/.vitepress/config.mts`.
4. Add the platform and configuration-page link to `docs/index.md` wherever the existing Express/Koa/Fastify list appears.

Follow this order: create the package; implement the platform adaptations; add the SDK matrix and its fixtures; execute the matrix; iterate on missing framework features until it passes; then run the package tests, `yarn tsc -b` from the repository root, affected lint checks, and the documentation build. Do not use a package-scoped `tsc --build` command.

## Completion checklist

- Every mandatory `PlatformTestSdk` group is enabled and passing; none is skipped.
- The complete `test/platform-<framework>.spec.ts` matrix, checked against the Express, Koa, and Fastify precedents, exists and has been executed successfully.
- Framework capability gaps are documented in `capabilities.md`, the platform configuration page, navigation, and homepage.
- `PlatformAdapter` lifecycle, request/response/handler bindings, and route conversion are covered.
- Public package metadata, exports, peer dependencies, docs, and integration tests are complete.
- No Express/Koa/Fastify assumptions remain in the new adapter.
