---
description: "Documentation over Logger by Ts.ED framework."
head:
  - - meta
    - name: description
      content: Documentation over Logger by Ts.ED framework.
  - - meta
    - name: keywords
      content: logger decorators ts.ed express.js koa.js typescript node.js javascript
---

# Logger

Ts.ED has its own logger available through [`@tsed/logger`](https://logger.tsed.dev) package.

## Installation

::: code-group

```sh [npm]
npm install --save @tsed/logger
```

```sh [yarn]
yarn add @tsed/logger
```

```sh [pnpm]
pnpm add @tsed/logger
```

```sh [bun]
bun add @tsed/logger
```

:::

## Features

Ts.ED logger supports many features, and is optimized to be used in production:

- @@ContextLogger@@ buffers the request logs and writes them when the response is sent to your consumer.
  See [request logger](/docs/logger.html#request-logger) section below.
- [Layouts](https://logger.tsed.dev/layouts) support,
- [Appenders](https://logger.tsed.dev/appenders) support;

## Configuration

Logger can be configured through the @@Configuration@@ decorator:

<div class="table-features">

| Props                         | Description                                                                                                                                                                                                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logger.level`                | Change the default log level displayed in the terminal. Values: `debug`, `info`, `warn`, `error` or `off`. By default: `info` (`off` when `NODE_ENV` is `test`).                                                                                                           |
| `logger.logRequest`           | Log all incoming requests. Requires `@tsed/platform-log-request` (see [request logger](/docs/logger.html#request-logger)). By default, it's true.                                                                                                                          |
| `logger.alterLog`             | A function `(level, obj, ctx) => obj` called to alter each object logged through `ctx.logger`. Requires `@tsed/platform-log-request`. By default: `defaultAlterLog`.                                                                                                       |
| `logger.onLogResponse`        | A function `(ctx) => void` called when the response is sent, to log the end of the request. Requires `@tsed/platform-log-request`. By default: `defaultLogResponse`.                                                                                                       |
| `logger.requestFields`        | **Legacy**. Only read by the deprecated `@tsed/platform-log-middleware` package. It has no effect with `@tsed/platform-log-request`; use `logger.alterLog` instead.                                                                                                        |
| `logger.reqIdBuilder`         | A function called for each incoming request to create a request id. By default, the `x-request-id` header is used, otherwise a uuid v4 is generated.                                                                                                                       |
| `logger.jsonIndentation`      | The number of space characters to use as white space in JSON output. The value is always computed by Ts.ED from `NODE_ENV`: 2 (0 in production). A value given in the configuration is overwritten.                                                                        |
| `logger.disableRoutesSummary` | Disable routes table displayed in the logger.                                                                                                                                                                                                                              |
| `logger.format`               | Specify log format. Example: `%[%d{[yyyy-MM-dd hh:mm:ss,SSS}] %p%] %m`. Requires the `@tsed/logger-pattern-layout` package to be installed and imported, otherwise the logger falls back to the colored layout. See [@tsed/logger configuration](https://logger.tsed.dev). |
| `logger.ignoreUrlPatterns`    | (`String` or `RegExp`) List of patterns to ignore logged request according to the `request.url`.                                                                                                                                                                           |

</div>

::: warning
It's recommended to disable logRequest in production. Logger has a cost on the performance.
:::

## Layouts and Appenders

### Layouts

You can configure a [layout](https://logger.tsed.dev/layouts) to format the log output. The following layouts are available:

| Name                                                                        | Description                                                                                                                        |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [Basic layout](https://logger.tsed.dev/layouts/basic.html)                  | Basic layout will output the timestamp, level, category, followed by the formatted log event data.                                 |
| [Colored layout](https://logger.tsed.dev/layouts/colored.html)              | This layout is the same as basic, except that the timestamp, level and category will be colored according to the log event's level |
| [Dummy layout](https://logger.tsed.dev/layouts/dummy.html)                  | This layout only outputs the first value in the log event's data.                                                                  |
| [Message layout](https://logger.tsed.dev/layouts/message-pass-through.html) | Use a simple message format to display log                                                                                         |
| [Json layout](https://logger.tsed.dev/layouts/json.html)                    | Display log to JSON format                                                                                                         |
| [Pattern layout](https://logger.tsed.dev/layouts/pattern.html)              | Use custom pattern to format log                                                                                                   |
| [Custom layout](https://logger.tsed.dev/layouts/custom.html)                | logging to stdout or stderr with a custom layout.                                                                                  |

### Appenders

You can configure an [appender](https://logger.tsed.dev/appenders) to send log events to a destination.
The following appenders are available:

| Name                                                                  | Description                                                                 |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Connect](https://logger.tsed.dev/appenders/connect.html)             | allows connecting Ts.ED logger with another logger.                         |
| [Console](https://logger.tsed.dev/appenders/console.html)             | log to the console.                                                         |
| [File](https://logger.tsed.dev/appenders/file.html)                   | log to a file.                                                              |
| [File date](https://logger.tsed.dev/appenders/file-date.html)         | log to a file with configurable log rolling based on file size or date.     |
| [Stdout](https://logger.tsed.dev/appenders/stdout.html)               | log to stdout.                                                              |
| [Stderr](https://logger.tsed.dev/appenders/stderr.html)               | log to stderr.                                                              |
| [Insight](https://logger.tsed.dev/appenders/insight.html)             | log to [Insight](https://insight.io/).                                      |
| [LogEntries](https://logger.tsed.dev/appenders/logentries.html)       | log to [LogEntries](https://logentries.com/).                               |
| [LogStash HTTP](https://logger.tsed.dev/appenders/logstash-http.html) | log to [LogStash](https://www.elastic.co/logstash).                         |
| [LogStash UDP](https://logger.tsed.dev/appenders/logstash-udp.html)   | log to [LogStash](https://www.elastic.co/logstash).                         |
| [Loggly](https://logger.tsed.dev/appenders/loggly.html)               | log to [Loggly](https://www.loggly.com/).                                   |
| [RabbitMQ](https://logger.tsed.dev/appenders/rabbitmq.html)           | log to [RabbitMQ](https://www.rabbitmq.com/).                               |
| [Seq](https://logger.tsed.dev/tutorials/seq.html)                     | log to [Seq](https://datalust.co/seq).                                      |
| [Slack](https://logger.tsed.dev/appenders/slack.html)                 | log to [Slack](https://slack.com/).                                         |
| [Smtp](https://logger.tsed.dev/appenders/smtp.html)                   | log to [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). |

::: tip
You can create your own layout/appender:

- [Customize appender (channel)](https://logger.tsed.dev/appenders/custom.html),
- [Customize layout](https://logger.tsed.dev/layouts/custom.html)

:::

## Use Json Layout in production

You add this code to switch the logger to Json layout in production mode:

```typescript
import {Env} from "@tsed/core";
import {Configuration} from "@tsed/di";
import {$log} from "@tsed/logger";
import "@tsed/logger/layouts/JsonLayout.js"; // add this line since @tsed/logger v8
import "@tsed/platform-express";

export const isProduction = process.env.NODE_ENV === Env.PROD;

if (isProduction) {
  $log.appenders.set("stdout", {
    type: "stdout",
    levels: ["info", "debug"],
    layout: {
      type: "json"
    }
  });
  $log.appenders.set("stderr", {
    levels: ["trace", "fatal", "error", "warn"],
    type: "stderr",
    layout: {
      type: "json"
    }
  });
}

@Configuration({
  logger: {
    disableRoutesSummary: isProduction // remove table with routes summary
  }
})
export class Server {}
```

This configuration will display the log as following:

```bash
{"startTime":"2017-06-05T22:23:08.479Z","categoryName":"json-test","data":["this is just a test"],"level":"INFO","context":{}}
```

It's more useful if you planned to parse the log with LogStash or any log tool parser.

## Inject logger

Logger can be injected in any injectable provider as follows:

```typescript
import {Logger} from "@tsed/logger";
import {Injectable, Inject} from "@tsed/di";

@Injectable()
export class MyService {
  @Inject()
  logger: Logger;

  $onInit() {
    this.logger.info("Hello world");
  }
}
```

::: tip
Prefer the @@ContextLogger@@ usage if you want to attach your log the current request. See the next section.
:::

## Request logger

For each Request, a logger will be attached to the @@PlatformContext@@ and can be used like here:

```typescript
import {Controller, Inject} from "@tsed/di";
import type {PlatformContext} from "@tsed/platform-http";
import {Context} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {MyService} from "../services/MyService.js";

@Controller("/")
class MyController {
  @Inject()
  myService: MyService;

  @Get("/")
  get(@Context() ctx: PlatformContext) {
    ctx.logger.info({customData: "test"}); // parameter is optional
    ctx.logger.debug({customData: "test"});
    ctx.logger.warn({customData: "test"});
    ctx.logger.error({customData: "test"});
    ctx.logger.trace({customData: "test"});

    // forward ctx object to the service and use logger inside.
    // All logs are attached to the same request
    this.myService.doSomething("test", ctx);
  }
}
```

```typescript
import {Injectable} from "@tsed/di";
import type {PlatformContext} from "@tsed/platform-http";

@Injectable()
export class MyService {
  doSomething(input: string, ctx: PlatformContext) {
    ctx.logger.info({event: "test", input});
  }
}
```

::: tip
All log use through `ctx.logger` will be associated with the uniq request id generated by Ts.ED.
:::

::: tip
@@ContextLogger@@ buffers the request logs and writes them when the response is sent to your consumer. The buffer is also
flushed as soon as it exceeds `logger.maxStackSize` entries (30 by default) or when an `error` or `fatal` log is emitted.
:::

By default, a log emitted through `ctx.logger` contains `reqId`, `time`, `duration` and your own data. To add the
request information and to log the end of each request, install `@tsed/platform-log-request` and import it in your
server:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-log-request";

@Configuration({
  logger: {
    logRequest: true // default value
  }
})
export class Server {}
```

With this module, a call with one of these methods will generate a log with the `method`, `url` and `route` of the
request on the `info` level:

```bash
[2017-09-01 11:12:46.994] [INFO ] [TSED] - {
  "method": "GET",
  "url": "/api-doc/swagger.json",
  "route": "/api-doc/swagger.json",
  "reqId": "e6ebb0ec5b6d4d2a9d3b3d3a0a6f1b2c",
  "time": "2017-09-01T11:12:46.994Z",
  "duration": 92,
  "customData": "test"
}
```

On the other levels (`debug`, `warn`, `error`, etc.), `headers`, `body`, `query` and `params` are also added.

When the response is sent, the module logs a `request.end` event with the `status`, `status_code` and `state` (`OK` or
`KO`) fields. This event is logged on the `error` level, with the error details (`error_name`, `error_message`,
`error_stack`, etc.), when the response status is greater than or equal to 400, otherwise on the `info` level.

::: warning
The `logger.requestFields` option and the `PlatformLogMiddleware` class come from the deprecated
`@tsed/platform-log-middleware` package. They have no effect with `@tsed/platform-log-request`: use the `alterLog` and
`onLogResponse` options instead.
:::

You can change the logged fields by giving your own `alterLog` function. It receives the log level, the object to log
and the current context. It's called for each log emitted through `ctx.logger`:

```typescript
import {Configuration, type DIContext} from "@tsed/di";
import "@tsed/platform-log-request";

function alterLog(level: string, obj: Record<string, unknown>, ctx: DIContext) {
  const {request} = ctx;

  // NOTE: request => PlatformRequest. To get Express.Request use ctx.getRequest<Express.Request>();
  return {
    method: request.method,
    url: request.url,
    headers: request.headers,
    body: request.body,
    query: request.query,
    params: request.params,
    ...obj
  };
}

@Configuration({
  logger: {
    alterLog
  }
})
export class Server {}
```

Another example to redact some fields, based on the default implementation:

```typescript
import {Configuration, type DIContext} from "@tsed/di";
import {defaultAlterLog} from "@tsed/platform-log-request";

const attributesToHide = ["password", "client_secret"];

function redactAttributes(body: any): any {
  if (body && typeof body === "object") {
    body = {...body};

    for (const attribute of attributesToHide) {
      if (body[attribute]) {
        body[attribute] = "[REDACTED]";
      }
    }
  }

  return body;
}

function alterLog(level: string, obj: Record<string, unknown>, ctx: DIContext) {
  const log: Record<string, unknown> = defaultAlterLog(level, obj, ctx);

  if ("body" in log) {
    log.body = redactAttributes(log.body);
  }

  return log;
}

@Configuration({
  logger: {
    alterLog
  }
})
export class Server {}
```

The log emitted when the response is sent can be replaced with the `onLogResponse` option:

```typescript
import {Configuration, type DIContext} from "@tsed/di";
import "@tsed/platform-log-request";

function onLogResponse(ctx: DIContext) {
  ctx.logger.info({
    event: "request.end",
    status: ctx.response.statusCode
  });
}

@Configuration({
  logger: {
    onLogResponse
  }
})
export class Server {}
```

## Shutdown logger

Shutdown returns a Promise that will be resolved when `@tsed/logger` has closed all appenders and finished writing log
events.
Use this when your program exits to make sure all your logs are written to files, sockets are closed, etc.

```typescript
import {$log} from "@tsed/logger";

$log.shutdown().then(() => {
  console.log("Complete");
});
```
