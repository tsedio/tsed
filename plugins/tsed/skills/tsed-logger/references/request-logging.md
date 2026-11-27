# `logger` configuration and request logging (Ts.ED v8)

Source of truth: `DILoggerOptions` in `@tsed/di`, `PlatformLogRequestSettings` in `@tsed/platform-log-request`, and the defaults applied by `@tsed/platform-http`. General configuration mechanics belong to the sibling skill `tsed-configuration`.

## `logger` keys

| Key                    | Type                                              | Default                       | Effect                                                                                      |
| ---------------------- | ------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| `level`                | `"debug" \| "info" \| "warn" \| "error" \| "off"` | `"info"`; `"off"` in test env | Global threshold applied to `$log` and to each request logger.                              |
| `logRequest`           | `boolean`                                         | `true`                        | Emit the request end log. Requires `@tsed/platform-log-request`.                            |
| `alterLog`             | `(level, obj, $ctx) => object`                    | adds method, url, route       | Transform every object logged through `$ctx.logger`. Requires `@tsed/platform-log-request`. |
| `onLogResponse`        | `($ctx) => void`                                  | logs `request.end`            | Replace the request end log. Requires `@tsed/platform-log-request`.                         |
| `ignoreUrlPatterns`    | `(string \| RegExp)[]`                            | -                             | Drop every `$ctx.logger` entry of requests whose URL matches. Strings become `RegExp`.      |
| `reqIdBuilder`         | `(req) => string`                                 | built-in id generator         | Build the request id exposed as `$ctx.id` and `reqId`.                                      |
| `maxStackSize`         | `number`                                          | `30`                          | Number of request log entries buffered before a flush. `0` writes immediately.              |
| `format`               | `string`                                          | -                             | Pattern layout applied to `stdout`/`stderr`. Requires `@tsed/logger-pattern-layout`.        |
| `disableRoutesSummary` | `boolean`                                         | `false`                       | Do not print the routes table (and the OpenAPI URLs) at startup.                            |
| `disableBootstrapLog`  | `boolean`                                         | `false`                       | Do not print bootstrap progress logs.                                                       |
| `debug`                | `boolean`                                         | `false`                       | Enable debug mode.                                                                          |
| `perf`                 | `boolean`                                         | -                             | Enable the log performance tracker.                                                         |
| `jsonIndentation`      | `number`                                          | `0` in production, else `2`   | Always overwritten from `NODE_ENV`; a configured value is ignored.                          |

Not read by `@tsed/platform-log-request`: `requestFields`, `logStart`, `logEnd`. They only apply to the deprecated `@tsed/platform-log-middleware`.

## Enable request logging

```bash
npm install @tsed/platform-log-request
```

```typescript
import "@tsed/platform-express";
import "@tsed/platform-log-request";
import {Configuration} from "@tsed/di";

@Configuration({logger: {logRequest: true}})
export class Server {}
```

What it does, per request:

1. On `$onRequest`: installs `alterLog` on `$ctx.logger`.
2. On `$onResponse`: calls `onLogResponse($ctx)`. The default logs at `info` for status < 400 and at `error` otherwise:

```json
{
  "reqId": "...",
  "time": "...",
  "duration": 12,
  "method": "GET",
  "url": "/rest/orders",
  "route": "/rest/orders",
  "event": "request.end",
  "status": 200,
  "status_code": "200",
  "state": "OK"
}
```

On errors the entry also contains `error_name`, `error_message`, `error_errors`, `error_stack`, `error_body`, `error_headers` when available.

The default `alterLog` adds `method`, `url`, `route` at `info` level, and additionally `headers`, `body`, `query`, `params` at every other level (`debug`, `warn`, `error`). Error-level lines therefore contain request headers and body unless you override it.

## Redact or reshape request logs

```typescript
import type {DIContext} from "@tsed/di";
import {defaultAlterLog} from "@tsed/platform-log-request";

const SENSITIVE = ["authorization", "cookie"];

export function alterLog(level: string, obj: Record<string, unknown>, $ctx: DIContext) {
  const log = defaultAlterLog(level, obj, $ctx) as Record<string, any>;

  if (log.headers) {
    log.headers = Object.fromEntries(Object.entries(log.headers).filter(([key]) => !SENSITIVE.includes(key)));
  }

  delete log.body;

  return log;
}
```

Custom end-of-request log:

```typescript
import type {BaseContext, DIContext} from "@tsed/di";
import {defaultLogResponse} from "@tsed/platform-log-request";

export function onLogResponse($ctx: DIContext) {
  const ctx = $ctx as BaseContext;

  if (ctx.response.statusCode !== 304) {
    defaultLogResponse(ctx);
  }
}
```

```typescript
@Configuration({logger: {alterLog, onLogResponse}})
export class Server {}
```

## Request logger behaviour (`ContextLogger`)

- Available as `$ctx.logger` (`@Context() $ctx: Context` from `@tsed/platform-params`), `context().logger` or `contextLogger()` from `@tsed/di`.
- Methods: `trace`, `debug`, `info`, `warn`, `error`, `fatal`. One argument each; a string becomes `{message}`.
- Every entry is enriched with `reqId`, `time`, `duration` (ms since the request started), then passed through `alterLog`.
- Entries are buffered and written through the global logger when the buffer exceeds `maxStackSize`, on `error`/`fatal`, and when the request context is destroyed.
- `$ctx.logger.alterLog(cb)` and `$ctx.logger.alterIgnoreLog(cb)` add per-request hooks, for example from a middleware (sibling skill `tsed-middlewares`).
- Streaming endpoints (SSE) set `$ctx.logger.maxStackSize = 0` so logs are not held until the stream closes.
- Outside a request, `context()` returns a throw-away context: logs are written immediately and `reqId` is a random id.

## Migrating from v7

- Request logs disappeared after upgrading: v8 no longer auto-imports the request logger. Add `import "@tsed/platform-log-request"` (preferred) or keep `@tsed/platform-log-middleware` and register `PlatformLogMiddleware` in `middlewares`. See https://tsed.dev/introduction/migrate-from-v7.md and the sibling skill `tsed-migration`.
- Overriding `PlatformLogMiddleware` with `@OverrideProvider` only works with the deprecated middleware package. Port the logic to `logger.alterLog` / `logger.onLogResponse`.

## Tests

`PlatformTest.create()` and `PlatformTest.bootstrap()` default `logger.level` to `off`. Pass `{logger: {level: "info"}}` to see output, or spy on `$ctx.logger` / `inject(Logger)` to assert log calls (sibling skill `tsed-testing`).
