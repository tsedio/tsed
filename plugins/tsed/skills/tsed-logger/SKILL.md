---
name: tsed-logger
description: Configure and use logging in a Ts.ED v8 application with @tsed/logger v8. Covers logger injection, request-scoped logs with $ctx.logger, the `logger` configuration key, @tsed/platform-log-request, appenders, layouts, JSON logs in production, connectors and custom appenders. Use when working with $log, inject(Logger), logger(), ContextLogger, $log.appenders.set, @Appender, @Layout or any @tsed/logger-* package, or when seeing "Appender ... doesn't exists", "Missing ... layout doesn't exists", duplicated log lines, missing request logs after a v8 upgrade, or an appender ignoring its levels.
---

# Ts.ED Logger

Ts.ED logs through one global `Logger` instance (`$log` from `@tsed/logger`) plus one `ContextLogger` per request (`$ctx.logger`). Appenders decide where events go, layouts decide how they look.

Read [the appender and layout reference](references/appenders-layouts.md) before configuring outputs and [the request logging reference](references/request-logging.md) before touching the `logger` configuration key.

## 1. Know what is already installed

- `@tsed/logger` and `@tsed/logger-std` are dependencies of `@tsed/platform-http`. A Ts.ED HTTP application already has two appenders on `$log`: `stdout` (levels `info`, `debug`) and `stderr` (levels `trace`, `fatal`, `error`, `warn`), both with the colored layout.
- Outside an HTTP application (script, worker, library), `$log` only has one console appender registered under the name `stdout`.
- Everything else is opt-in in v8: install the package and import it for its side effect before calling `$log.appenders.set()`.

## 2. Get a logger

Use the application logger for lifecycle and background work:

```typescript
import {Injectable, inject} from "@tsed/di";
import {Logger} from "@tsed/logger";

@Injectable()
export class BillingService {
  protected logger = inject(Logger);

  $onInit() {
    this.logger.info({event: "BILLING_READY"});
  }
}
```

`logger()` from `@tsed/di` returns the same instance without a class; `@Inject() logger: Logger` also works. Do not create `new Logger()` in application code: it has no appenders and ignores the Ts.ED configuration.

## 3. Log inside a request

Use the request logger so every line carries `reqId`, `time` and `duration`:

```typescript
import {Controller} from "@tsed/di";
import {Context} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

@Controller("/orders")
export class OrdersController {
  @Get("/")
  list(@Context() $ctx: Context) {
    $ctx.logger.info({event: "ORDERS_LIST", tenant: $ctx.request.headers["x-tenant"]});
  }
}
```

In a service called during the request, use `context().logger.info({...})` (`context` from `@tsed/di`) instead of passing `$ctx` around.

- `$ctx.logger` methods take **one** argument: an object, or a string (stored as `message`).
- Request logs are buffered (`logger.maxStackSize`, default 30) and flushed when the request ends; `error` and `fatal` flush immediately.
- Never put per-request data on the global logger (`$log.context.set(...)`, a shared field, a custom appender state). Concurrent requests overwrite each other.

## 4. Configure levels and request logging

```typescript
import "@tsed/platform-express";
import "@tsed/platform-log-request";
import {Configuration} from "@tsed/di";

@Configuration({
  logger: {
    level: "info",
    logRequest: true,
    ignoreUrlPatterns: ["^/health", /^\/metrics/],
    disableRoutesSummary: process.env.NODE_ENV === "production"
  }
})
export class Server {}
```

1. `level` accepts `debug`, `info`, `warn`, `error`, `off`. The default is `info`, and `off` when `NODE_ENV=test`.
2. In v8, request start/end logs exist only after `import "@tsed/platform-log-request"`. Without it `logRequest` does nothing.
3. Shape or redact request logs with `logger.alterLog(level, obj, $ctx)` and `logger.onLogResponse($ctx)`.
4. Remaining keys: `reqIdBuilder`, `maxStackSize`, `format`, `disableBootstrapLog`, `debug`, `perf`. See the reference.

## 5. Configure appenders

```typescript
import {$log} from "@tsed/logger";
import "@tsed/logger-std";
import "@tsed/logger/layouts/JsonLayout.js";

if (process.env.NODE_ENV === "production") {
  $log.appenders
    .set("stdout", {type: "stdout", levels: ["info", "debug"], layout: {type: "json"}})
    .set("stderr", {type: "stderr", levels: ["trace", "fatal", "error", "warn"], layout: {type: "json"}});
}
```

1. Run this at module top level, before bootstrap. Keep the explicit `import "@tsed/logger-std"` in the same file: that import resets `stdout`/`stderr` to their defaults, so it must run before your `set()` calls, not after.
2. Reuse the names `stdout` and `stderr` to **replace** the default appenders. Any other name **adds** an output and duplicates every line; call `$log.appenders.delete("stdout")` or `.clear()` first when that is not wanted.
3. Filter with `levels` (plural, array of level names). Omit it to receive every level.
4. Layouts other than `colored` need an import: `@tsed/logger/layouts/JsonLayout.js`, `BasicLayout.js`, `MessagePassThroughLayout.js`, `DummyLayout.js`, `ObjectLayout.js`; `pattern` needs the `@tsed/logger-pattern-layout` package.
5. With the JSON layout, log objects: their keys are merged at the root of the JSON line. Strings end up in the `data` array.

## 6. Add a connector

Install, import, then register. Available packages: `@tsed/logger-file`, `-logstash-http`, `-logstash-udp`, `-seq`, `-loggly`, `-slack`, `-rabbitmq`, `-smtp`, `-insight`, `-logentries`, `-connect`.

```typescript
import {$log} from "@tsed/logger";
import {FileAppender} from "@tsed/logger-file";

$log.appenders.set("file", {
  type: FileAppender,
  filename: "logs/app.log",
  pattern: ".yyyy-MM-dd",
  levels: ["info", "warn", "error", "fatal"]
});
```

- Prefer passing the appender **class** as `type`: it proves the package is imported and avoids typos in the string name.
- Connector settings go under `options`; file settings (`filename`, `maxLogSize`, `backups`, `pattern`) stay at the top level.

## 7. Write a custom appender or layout

Extend `BaseAppender` with `@Appender({name})` and implement `write(loggingEvent)`; extend `BaseLayout` with `@Layout({name})` and implement `transform(loggingEvent, timezoneOffset)`. Import the file once before `appenders.set()`. Templates are in [the reference](references/appenders-layouts.md#custom-appender).

## 8. Shut down cleanly

Call `await $log.shutdown()` in the `$onDestroy()` hook of `Server` or in the signal handler. File, UDP, SMTP, RabbitMQ and HTTP-batching appenders lose buffered events otherwise. `shutdown()` also sets the level to `OFF`.

## Do not

- Do not use `console.log` in application code; it bypasses levels, layouts and request correlation.
- Do not write `level: [...]` on an appender; the key is `levels`. `level` is silently ignored and the appender receives everything.
- Do not import layouts or `StdoutAppender` from the `@tsed/logger` root; v8 moved them (see step 5).
- Do not log secrets, tokens or full request bodies; redact in `logger.alterLog`.

## Pitfalls

- An unknown appender `type` only prints `Appender <type> doesn't exists. Check your configuration.` and silently falls back to the console appender. An unknown layout prints `Missing <name> layout doesn't exists.` and falls back to `colored`. Treat both warnings as errors.
- `@tsed/logger-logstash-udp` registers itself under the name `logstash-http`, not `logstash-udp`. `type: "logstash-udp"` falls back to console. Pass `type: LogStashUdpAppender`, and do not load both logstash packages in one process (the last import wins the name).
- `logger.format` rewrites `stdout`/`stderr` with the pattern layout; it requires `import "@tsed/logger-pattern-layout"`, and it overrides appenders set earlier under those names.
- `logger.requestFields`, `logStart` and `logEnd` belong to the deprecated `@tsed/platform-log-middleware`; `@tsed/platform-log-request` ignores them.
- `logger.jsonIndentation` is forced by `NODE_ENV` (0 in production, 2 otherwise); setting it has no effect.
- `logger().stop()` / `level: "off"` silences everything, including errors. Tests run with `off` by default; pass `logger: {level: "info"}` to `PlatformTest.bootstrap()` to see logs.

## Checklist

- No `console.*` and no `new Logger()` in application code; services use `inject(Logger)` or `context().logger`.
- Request-specific data is logged through `$ctx.logger` only.
- `@tsed/platform-log-request` is imported when request logs are expected.
- Every appender `type` and layout `type` has its package or layout module imported; startup prints no "doesn't exists" warning.
- Appenders use `levels`, and no line is emitted twice.
- Production output is JSON on stdout/stderr, with `disableRoutesSummary: true`.
- `$log.shutdown()` is awaited on exit when a buffering appender is configured.

Further reading: https://tsed.dev/docs/logger.md, https://logger.tsed.dev/llms.txt, https://logger.tsed.dev/introduction/getting-started.md, https://logger.tsed.dev/introduction/migrate-to-v8.md.
