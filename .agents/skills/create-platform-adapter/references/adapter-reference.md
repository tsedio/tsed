# Ts.ED platform adapter reference

## Shared contract

`PlatformAdapter<App>` is the boundary between Ts.ED and a web framework. Its mandatory methods are `useContext()`, `mapLayers()`, `createApp()`, and `bodyParser()`. `onInit()` and `afterLoadRoutes()` are extension points. A new adapter should also provide static `create()` and `bootstrap()` helpers through `PlatformBuilder` and register concrete abstractions with `adapter()`.

| Concern            | Express                              | Koa                   | Fastify                          |
| ------------------ | ------------------------------------ | --------------------- | -------------------------------- |
| Application        | `Express()`                          | `new Koa()`           | `Fastify(options)`               |
| Router             | application methods                  | `@koa/router`         | `instance.route()`               |
| Middleware model   | `(req, res, next)`                   | `(ctx, next)` async   | hooks/plugins plus route handler |
| Native callback    | app itself                           | `app.callback()`      | Node server from Fastify         |
| Context completion | response `finish`                    | raw response `finish` | reply/raw response lifecycle     |
| Route conversion   | version-sensitive Express conversion | Koa router syntax     | Fastify router syntax            |
| Static files       | `express.static` wrapper             | `koa-send` wrapper    | `@fastify/static` plugin         |

## Package precedent

All current platform packages provide ESM package metadata, `src/index.ts`, `tsconfig.esm.json`, `vitest.config.mts`, focused source tests, and integration fixtures. Their package manifests expose `src/index.ts`, build with barrels plus TypeScript project references, and test with Vitest.

Declare Ts.ED libraries and the target framework as peers. Keep test-only frameworks/plugins in `devDependencies`. Put a runtime dependency in `dependencies` only when it is required for every consumer of the adapter.

## Factory helpers

`PlatformBuilder.create()` and `PlatformBuilder.bootstrap()` accept a configuration object. Platform adapters that retain the public `create(module, settings)` and `bootstrap(module, settings)` helpers must normalize their arguments and instantiate `new PlatformBuilder({rootModule, ...settings, adapter})` directly. Distinguish the configuration-only form before assigning `rootModule`; never treat a settings object as a module. `create()` must disable HTTP and HTTPS listeners; `bootstrap()` must call `.bootstrap()` on the new builder. Keep a configuration-only overload when it is part of the existing adapter API, and test both overload forms for both helpers.

## Context and handler flow

1. `useContext()` calls `createContext()` with the framework request/response and waits for `$ctx.start()`.
2. Store or recover `$ctx` so all mapped handlers execute in the same DI context.
3. `mapHandler()` runs the Ts.ED handler, catches async errors, and transfers control using the framework's native error mechanism.
4. Finish `$ctx` when the underlying response is completed, even for error responses.

Express has separate regular and error middleware signatures and uses `runInContext`. Koa obtains `$ctx` from its request and awaits `next()`. Fastify adapts hooks and route handlers; its plugin registration and server readiness can be asynchronous.

## Request and response adapters

`PlatformRequest` and `PlatformResponse` hide framework differences. Implement accessors based on the framework's real semantics, not a simulated Express API.

Request coverage should include raw/native request retrieval, protocol, host, URL/query/path, params, headers, cookies, session, secure state, and raw body where available. Response coverage should include status, headers, cookies, redirect, serialization, `end`, file/download, stream, and `isDone` behavior.

Fetch-native frameworks need an explicit response construction and streaming strategy. A mutable Node `ServerResponse` assumption is incompatible with a `Response` return value unless the framework supplies a Node adapter.

## Integration capability matrix

Every platform package defines `test/platform-<framework>.spec.ts` using `PlatformTestSdk.create({rootDir, adapter, server})`. It is the platform's executable compatibility statement.

Copy the matrix shape from `platform-express` and enumerate the core groups: handlers, children controllers, inheritance, response, stream, middleware, scope request, headers, content negotiation, header/path/query/body parameters, cookies, session, location, redirect, errors, response filters, routing, locals, auth, modules, and cache. Add the plugin groups: views, static files, multipart/Multer, deep query parameters, and custom 404.

Use `describe.skip` only for a known unsupported feature. Keep the `utils.test()` call inside the skipped block, state the limitation in its label/comment, and record the same unsupported feature in `docs/introduction/capabilities.md`. For example, Fastify skips stream, session, and deep-query tests; these are documented as compatibility limitations. Do not delete unavailable suites or skip failures without updating the capability documentation.

## Website documentation

A new adapter requires all of these documentation surfaces:

- Add its support column to both feature and plugin tables in `docs/introduction/capabilities.md`, including explanatory notes for partial support.
- Add `docs/docs/configuration/<framework>.md` with installation, adapter options/plugins, static files, and custom application setup.
- Link the page from `docs/docs/configuration/index.md` and the Configuration sidebar in `docs/.vitepress/config.mts`.
- Extend `docs/index.md` metadata, platform lists, and links where Express/Koa/Fastify are named.

Treat integration skips, capabilities, and documentation as one consistency unit: a supported capability has an enabled test; an unsupported one has a retained skipped test and a documented limitation.

## Route and integration hazards

- Path token syntax differs. Test conversion before registering routes; wildcard parameters are especially divergent.
- Koa's composed middleware, Fastify's hooks/plugins, and Fetch `Response` values cannot use Connect's `next(error)` convention unchanged.
- Multipart, static assets, views, compression, and raw-body capture often require framework plugins and timing-sensitive registration.
- HTTP/HTTPS server ownership varies. Ensure close, listen, and callback behavior are tested under the supported runtime.
- Do not claim compatibility with serverless or Bun until an integration test proves the chosen entry point works.
