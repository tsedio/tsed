---
name: tsed-configuration
description: Configure and bootstrap a Ts.ED v8 server - the @Configuration decorator or configuration() on the Server class, PlatformExpress/PlatformKoa/PlatformFastify.bootstrap, server options (mount, middlewares, httpPort, httpsPort, acceptMimes, logger, statics, views, responseFilters, imports), per-platform express/koa/fastify options, and @tsed/config sources (envs, dotenv, json, yaml). Use when editing Server.ts, index.ts or src/config, adding @tsed/config or the extends option, or reading settings with constant(), refValue(), @Constant, @Value or configuration().get().
---

# Configure a Ts.ED Server

Keep all settings in one place (the `Server` class and `src/config/`), and read them through the DI configuration API instead of `process.env` scattered in services.

Read [the server options reference](references/server-options.md) before adding an option you have not used before. For depth, see `https://tsed.dev/docs/configuration.md` and `https://tsed.dev/docs/configuration/server-options.md`.

## 1. Inspect the project first

1. Open `src/Server.ts`, `src/index.ts` and `src/config/` (a CLI project has `config/config.ts`, `config/logger/index.ts`, `config/utils/index.ts`).
2. Identify the platform from `package.json`: `@tsed/platform-express`, `@tsed/platform-koa` or `@tsed/platform-fastify`.
3. Do not add a second configuration entry point. Extend the existing `config` object or the `@Configuration` call.

## 2. Declare the Server

```typescript
import "@tsed/platform-log-request";
import "@tsed/ajv";
import {Configuration} from "@tsed/di";
import {application} from "@tsed/platform-http";
import {config} from "./config/config.js";
import {UsersController} from "./controllers/UsersController.js";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false,
  mount: {"/rest": [UsersController]},
  middlewares: ["cookie-parser", "compression", {use: "json-parser"}, {use: "urlencoded-parser", options: {extended: true}}]
})
export class Server {
  protected app = application();
}
```

- Functional equivalent: `configuration(Server, {...})` from `@tsed/di` after the class declaration.
- Type shared config as `Partial<TsED.Configuration>`. Declare custom keys by augmenting `namespace TsED { interface Configuration { myKey: MyOptions } }` in a `declare global` block.
- Import feature packages for their side effects (`@tsed/ajv`, `@tsed/swagger`, `@tsed/platform-log-request`, `@tsed/config`). A package that is never imported is never registered.
- Do not put glob strings in `mount`; import controller classes. Do not use `componentsScan`.

## 3. Bootstrap

```typescript
import {$log} from "@tsed/logger";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server.js";

try {
  const platform = await PlatformExpress.bootstrap(Server, {/* extra settings */});
  await platform.listen();
  process.on("SIGINT", () => platform.stop().then(() => process.exit(0)));
} catch (error) {
  $log.error({event: "SERVER_BOOTSTRAP_ERROR", message: (error as Error).message, stack: (error as Error).stack});
}
```

- Koa: `PlatformKoa` from `@tsed/platform-koa`. Fastify: `PlatformFastify` from `@tsed/platform-fastify`. Same `bootstrap(Server, settings?)`, `listen()`, `stop()` API.
- Settings passed to `bootstrap()` override `@Configuration` key by key; only `mount`, `scopes` and `logger` are merged.
- Use `Platform*.create(Server)` when no port must be opened (serverless, scripts): it forces `httpPort: false` and `httpsPort: false`.

## 4. Set server and platform options

1. Ports: `httpPort` / `httpsPort` accept a number, `"127.0.0.1:8081"`, `0` (random) or `false` (disabled). Defaults are `8080` and `false`. Set `httpsOptions` (`key`, `cert`) when HTTPS is enabled.
2. `middlewares`: a function, a Ts.ED middleware class, a module name string, or `{use, hook?, env?, options?}`. Default hook is `$beforeRoutesInit`. Built-in names: `json-parser`, `urlencoded-parser`, `text-parser`, `raw-parser`.
3. `statics`: `{"/": [{root: "./public", hook: "$beforeRoutesInit"}]}`.
4. `views`: `{root, extensions: {ejs: "ejs"}, viewEngine?}`; requires `@tsed/platform-views` and `@tsed/engines`.
5. `logger`: `DILoggerOptions` from `@tsed/di` (`level`, `disableRoutesSummary`, `ignoreUrlPatterns`, ...). Use tsed-logger for appenders and layouts.
6. `imports`: modules/providers to build first, or overrides `{token, use | useClass | useFactory | useAsyncFactory}`.
7. `responseFilters`: classes decorated with `@ResponseFilter`. See tsed-controllers.
8. Platform keys: `express.{bodyParser, router, app, version}`, `koa.{bodyParser, router, app}`, `fastify.{app, ...FastifyHttpOptions}` and top-level `plugins` for Fastify plugins.

## 5. Load configuration sources with @tsed/config

```typescript
import "@tsed/config";
import {withOptions} from "@tsed/config";
import {EnvsConfigSource} from "@tsed/config/envs";
import {JsonConfigSource} from "@tsed/config/json";
import {Configuration} from "@tsed/di";

@Configuration({
  extends: [withOptions(JsonConfigSource, {path: "./config.json", priority: 1}), withOptions(EnvsConfigSource, {priority: 2})]
})
export class Server {}
```

- Sources: `@tsed/config/envs` (`EnvsConfigSource`), `/dotenv` (`DotEnvsConfigSource`, needs `dotenv dotenv-expand dotenv-flow`), `/json` (`JsonConfigSource`), `/yaml` (`YamlConfigSource`, needs `js-yaml`).
- Sources apply in ascending `priority`; the last one wins. Each source is also exposed under `configs.<name>`; the default name is the class name without `ConfigSource`, camel-cased (`json`, `envs`, `dotEnvs`, `yaml`). Override with `name`.
- `withOptions` also accepts `validationSchema` (a `@tsed/schema` `object({...})`), `watch: true`, `refreshOn: "request" | "response"`, `enabled`.
- Premium sources (AWS Secrets Manager, Vault, Mongo, Postgres, IORedis): point to `https://tsed.dev/docs/configuration/configuration-sources.md`; do not reimplement them.

## 6. Read configuration

```typescript
import {constant, refValue, configuration, Injectable} from "@tsed/di";

@Injectable()
export class MailService {
  private readonly from = constant<string>("mail.from", "noreply@example.com"); // read once
  private readonly ttl = refValue<number>("cache.ttl", 60); // live: this.ttl.value

  dump() {
    return configuration().get<string>("env");
  }
}
```

- Decorator form: `@Constant("mail.from") from: string` (frozen copy, cached on first read) and `@Value("cache.ttl") ttl: number` (live, writable).
- Keys are dot paths. `injector().settings.get(key)` is the same object as `configuration()`.
- Do not call `constant()` at module top level: the configuration is not loaded yet. Call it in a class field, a factory, a hook, or a method.

## Pitfalls

- Missing `import "@tsed/config"` (or a `@tsed/config/<source>` subpath): `extends` is silently ignored.
- A bare source class gets `priority = index`, a `withOptions()` source gets `0` unless set. When mixing both forms, set `priority` explicitly.
- `@Constant` values are frozen and never refresh. Use `refValue()` / `@Value` with `watch` or `refreshOn` sources.
- A class-based Ts.ED middleware cannot use `hook: "$beforeInit" | "$onInit" | "$afterInit"`; bootstrap throws.
- `httpPort: process.env.PORT || 8083` evaluates at import time, before any `.env` source is loaded. Load dotenv through `extends`, or read the port from a source.
- Do not import from `@tsed/common`. In v8 use `@tsed/di`, `@tsed/platform-http`, `@tsed/platform-params`, `@tsed/schema`. See tsed-migration.

## Checklist

- `Server.ts` imports the platform's required side-effect packages and every controller is mounted by class reference.
- `index.ts` bootstraps with the adapter matching the installed platform package and handles `SIGINT`/`SIGTERM` with `platform.stop()`.
- Custom configuration keys are typed through `TsED.Configuration` augmentation.
- Services read settings with `constant()` / `refValue()` / `@Constant` / `@Value`, not `process.env`.
- `extends` sources have explicit priorities and a `validationSchema` for required keys.
- Related work is delegated: tsed-di (providers, hooks), tsed-middlewares, tsed-logger, tsed-testing (override settings in tests), tsed-cli (scaffolding).
