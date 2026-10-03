# Ts.ED server options reference

All keys belong to `TsED.Configuration` and are passed to `@Configuration({...})`, `configuration(Server, {...})` or `Platform*.bootstrap(Server, {...})`.

## Core options

| Key                            | Type                                                               | Default                                          | Declared by                      |
| ------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------ | -------------------------------- |
| `rootDir`                      | `string`                                                           | `process.cwd()`                                  | `@tsed/platform-http`            |
| `env`                          | `Env` (`production`, `development`, `test`) from `@tsed/core`      | `NODE_ENV` or `development`                      | `@tsed/platform-http`            |
| `httpPort`                     | `string \| number \| false`                                        | `8080`                                           | `@tsed/platform-http`            |
| `httpsPort`                    | `string \| number \| false`                                        | `false`                                          | `@tsed/platform-http`            |
| `httpOptions` / `httpsOptions` | Node `Http.ServerOptions` / `Https.ServerOptions`                  | none                                             | `@tsed/platform-http`            |
| `mount`                        | `Record<string, TokenProvider[]>`                                  | `{}`                                             | `@tsed/di`                       |
| `imports`                      | `(TokenProvider \| ImportTokenProviderOpts)[]`                     | `[]`                                             | `@tsed/di`                       |
| `scopes`                       | `{[providerType: string]: ProviderScope}`                          | controllers are `singleton`                      | `@tsed/di`                       |
| `lazyProviders`                | `boolean`                                                          | `false`                                          | `@tsed/di`                       |
| `logger`                       | `DILoggerOptions`                                                  | `{level: "info"}` (`"off"` when `env` is `test`) | `@tsed/di`                       |
| `middlewares`                  | `PlatformMiddlewareSettings[]`                                     | `[]`                                             | `@tsed/platform-middlewares`     |
| `acceptMimes`                  | `string[]`                                                         | none                                             | `@tsed/platform-accept-mimes`    |
| `statics`                      | `PlatformStaticsSettings`                                          | none                                             | `@tsed/platform-http`            |
| `views`                        | `PlatformViewsSettings`                                            | none                                             | `@tsed/platform-views`           |
| `responseFilters`              | `Type<ResponseFilterMethods>[]`                                    | none                                             | `@tsed/platform-response-filter` |
| `router`                       | `{appendChildrenRoutesFirst?: boolean}`                            | none                                             | `@tsed/platform-http`            |
| `jsonMapper`                   | `{additionalProperties, disableUnsecureConstructor, strictGroups}` | json-mapper defaults                             | `@tsed/platform-http`            |
| `rawBody`                      | `boolean`                                                          | auto-detected from `@RawBodyParams()`            | `@tsed/platform-http`            |
| `multer`                       | multer `Options`                                                   | none                                             | `@tsed/platform-multer`          |
| `cache`                        | `PlatformCacheSettings \| false`                                   | none                                             | `@tsed/platform-cache`           |
| `ajv`                          | `AjvSettings`                                                      | none                                             | `@tsed/ajv`                      |
| `swagger`                      | `SwaggerSettings[]`                                                | none                                             | `@tsed/swagger`                  |
| `extends`                      | `(Type<ConfigSource> \| ConfigSourceOptions)[]`                    | none                                             | `@tsed/config`                   |

A key only has an effect when the package that declares it is imported somewhere in the application.

## logger (DILoggerOptions)

`level` (`"debug" | "info" | "warn" | "error" | "off"`), `debug`, `perf`, `ignoreUrlPatterns`, `jsonIndentation`, `reqIdBuilder`, `disableRoutesSummary`, `disableBootstrapLog`, `format`, `maxStackSize`.

A CLI project keeps this in `src/config/logger/index.ts` and exports `<DILoggerOptions>{disableRoutesSummary: isProduction}`. Appender and layout setup belongs to tsed-logger.

## middlewares

```typescript
import {Env} from "@tsed/core";

middlewares: [
  "cors", // module name: imported, then called with `options`
  {use: "helmet", hook: "$afterInit", options: {contentSecurityPolicy: false}},
  {use: EnsureHttpsMiddleware, env: Env.PROD}, // Ts.ED middleware class, one env only
  {use: "json-parser"},
  {use: "urlencoded-parser", options: {extended: true}}
];
```

- Entry forms: function, class, string, or `{use, hook?, env?, options?}`.
- Default hook: `$beforeRoutesInit`. Allowed hooks for class middlewares: `$beforeRoutesInit`, `$onRoutesInit`, `$afterRoutesInit`, `$beforeListen`, `$afterListen`, `$onReady`.
- Middlewares listed here are registered after the ones added manually in the same Server hook method.

## statics

```typescript
statics: {
  "/": [{root: "./public", hook: "$beforeRoutesInit"}],
  "/docs": "./docs"
}
```

`hook` is `"$beforeRoutesInit"` or `"$afterRoutesInit"`. Extra keys are forwarded to the platform static handler (`express.static`, `koa-send`, `@fastify/static`).

## views

```typescript
views: {
  root: join(process.cwd(), "../views"),
  extensions: {ejs: "ejs"},
  viewEngine: "ejs"
}
```

Other keys: `disabled`, `cache`, `options` (per-engine options). See `https://tsed.dev/docs/templating.md`.

## imports

```typescript
imports: [
  DatabaseModule,
  {token: MailTransport, useClass: FakeMailTransport},
  {token: CLOCK, use: {now: () => 0}},
  {token: FEATURE_FLAGS, useFactory: () => ({beta: true})},
  {token: DB, useAsyncFactory: async () => connect()}
];
```

Override entries accept exactly `use`, `useClass`, `useFactory` or `useAsyncFactory`. `useValue` is not read here.

## Platform options

| Platform | Key                   | Fields                                                                                                                                                   |
| -------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Express  | `express`             | `version` (`"v4" \| "v5"`), `router` (Express `RouterOptions`), `app` (custom Express app), `bodyParser.{json,text,raw,urlencoded}` (options or factory) |
| Koa      | `koa`                 | `router` (`@koa/router` options), `bodyParser` (`koa-bodyparser` options or factory), `app` (custom Koa instance)                                        |
| Fastify  | `fastify`             | `app` (custom instance) plus any `FastifyHttpOptions`                                                                                                    |
| Fastify  | `plugins` (top level) | `(string \| plugin \| {use, options?, env?})[]`                                                                                                          |

Docs: `https://tsed.dev/docs/configuration/express.md`, `https://tsed.dev/docs/configuration/koa.md`, `https://tsed.dev/docs/configuration/fastify.md`.

## Configuration sources (@tsed/config)

```typescript
import {withOptions} from "@tsed/config";
import {DotEnvsConfigSource} from "@tsed/config/dotenv";
import {object, string} from "@tsed/schema";

extends: [
  withOptions(DotEnvsConfigSource, {
    name: "env",
    path: process.cwd(),
    priority: 1,
    watch: true,
    validationSchema: object({DATABASE_HOST: string().required()})
  })
];
```

- `withOptions(Source, opts)` reserves `name`, `priority`, `enabled`, `validationSchema`, `watch`, `refreshOn`; every other key goes to the source (`path`, `encoding`, `parseJson`, dotenv-flow options).
- Loaded values are merged at the configuration root (`constant("DATABASE_HOST")`) and stored under `configs.<name>` (`constant("configs.env.DATABASE_HOST")`).
- `EnvsConfigSource` parses JSON-looking values by default; pass `parseJson: false` to keep raw strings.
- Custom source: a class implementing `ConfigSource<Opts>` from `@tsed/config` with `options`, `getAll()`, and optional `watch(onChange)`, `$onInit()`, `$onDestroy()`.
- Sources are resolved on the `$afterResolveConfiguration` hook, before providers are built, so async factories can read them with `constant()`.

## Server lifecycle hooks usable on the Server class

`$beforeInit`, `$onInit`, `$afterInit`, `$beforeRoutesInit`, `$onRoutesInit`, `$afterRoutesInit`, `$beforeListen`, `$afterListen`, `$onReady`, `$onDestroy`. Details and ordering: tsed-di.
