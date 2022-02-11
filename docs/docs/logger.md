---
meta:
  - name: description
    content: Documentation over Logger by Ts.ED framework.
  - name: keywords
    content: logger decorators ts.ed express.js koa.js typescript node.js javascript
---

# Logger

Ts.ED has its own logger available through [`@tsed/logger`](https://logger.tsed.io) package.

## Features

Ts.ED logger supports many features, and is optimized to be used in production.

- Many [layout](https://logger.tsed.io/layouts) formats are supported:
- [Colored console](https://logger.tsed.io/layouts/colored.html) logging to stdout or stderr.
- [Json layout](https://logger.tsed.io/layouts/json.html).
- Many appender (stream) formats are supported:
  - [Console](https://logger.tsed.io/appenders/console.html).
  - [File](https://logger.tsed.io/appenders/file.html).
  - [File date](https://logger.tsed.io/appenders/file-date.html), with configurable log rolling based on file size or date.
  - [Stdout](https://logger.tsed.io/appenders/stdout.html).
  - [Stderr](https://logger.tsed.io/appenders/stderr.html).
  - [Insight](https://tsed.io/appenders/insight.md).
  - [LogEntries](https://tsed.io/appenders/logentries.md).
  - [LogStash HTTP](https://tsed.io/appenders/logstash-http.md).
  - [LogStash UDP](https://tsed.io/appenders/logstash-udp.md).
  - [Loggly](https://tsed.io/appenders/loggly.md).
  - [RabbitMQ](https://tsed.io/appenders/rabbitmq.md).
  - [Seq](https://tsed.io/tutorials/seq.md).
  - [Slack](https://tsed.io/tutorials/slack.md).
  - [Smtp](https://logger.tsed.io/appenders/smtp.html).
- @@ContextLogger@@, in **production** mode, caches all request logs until the response is sent to your consumer. See [request logger](/docs/logger.html#request-logger) section bellow.

You can create your own layout/appender:

- [Customize appender (chanel)](https://logger.tsed.io/appenders/custom.html),
- [Customize layout](https://logger.tsed.io/layouts/custom.html)

## Configuration

Logger can be configured through the @@Configuration@@ decorator:

<div class="table-features">

| Props                         | Description                                                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `logger.level`                | Change the default log level displayed in the terminal. Values: `debug`, `info`, `warn` or `error`. By default: `info`.                |
| `logger.logRequest`           | Log all incoming requests. By default, it's true and prints the configured `logger.requestFields`.                                     |
| `logger.requestFields`        | Fields displayed when a request is logged. Possible values: `reqId`, `method`, `url`, `headers`, `body`, `query`,`params`, `duration`. |
| `logger.reqIdBuilder`         | A function called for each incoming request to create a request id.                                                                    |
| `logger.jsonIndentation`      | The number of space characters to use as white space in JSON output. Default is 2 (0 in production).                                   |
| `logger.disableRoutesSummary` | Disable routes table displayed in the logger.                                                                                          |
| `logger.format`               | Specify log format. Example: `%[%d{[yyyy-MM-dd hh:mm:ss,SSS}] %p%] %m`. See [@tsed/logger configuration](https://logger.tsed.io).      |
| `logger.ignoreUrlPatterns`    | (`String` or `RegExp`) List of patterns to ignore logged request according to the `request.url`.                                       |

</div>

::: warning
It is recommended to disable logRequest in production. Logger has a cost on the performance.
:::

## Use Json Layout in production

You add this code to switch the logger to Json layout in production mode:

```typescript
import {env} from "@tsed/core";
import {$log, Configuration} from "@tsed/common";
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

It's more useful if you planed to parse the log with LogStash or any log tool parser.

## Inject logger

Logger can be injected in any injectable provider as follows:

```typescript
import {Logger} from "@tsed/common";
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
import {Controller, Context, Get} from "@tsed/common";
import {Logger} from "@tsed/logger";
import {MyService} from "../services/MyService";

@Controller("/")
class MyController {
  @Inject()
  myService: MyService;

  @Get("/")
  get(@Context() ctx: Context) {
    ctx.logger.info({customData: "test"}); // parameter is optional
    ctx.logger.debug({customData: "test"});
    ctx.logger.warn({customData: "test"});
    ctx.logger.error({customData: "test"});
    ctx.logger.trace({customData: "test"});

    // forward ctx object to the service and use logger inside.
    // All request
    myService.doSomething("test", ctx);
  }
}
```

```typescript
import {PlatformContext} from "@tsed/common";
import {Injectable, Inject} from "@tsed/di";

@Injectable()
export class MyService {
  doSomething(input: string, ctx: PlatformContext) {
    ctx.logger.info({event: "test", input});
  }
}
```

::: tip
All log use through ctx.logger will be associated with the uniq request id generated by Ts.ED.
:::

::: tip
@@ContextLogger@@, in **production** mode, caches all request logs until the response is sent to your consumer.
:::

A call with one of these methods will generate a log according to the `logger.requestFields` configuration:

```bash
[2017-09-01 11:12:46.994] [INFO ] [TSED] - {
  "status": 200,
  "reqId": 1,
  "method": "GET",
  "url": "/api-doc/swagger.json",
  "duration": 92,
  "headers": {
    "host": "0.0.0.0:8001",
    "connection": "keep-alive",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "accept-encoding": "gzip, deflate",
    "accept-language": "fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4"
  },
  "body": {},
  "query": {},
  "customData": "test"
}
```

You can configure the displayed fields from the server configuration:

```typescript
import {Configuration} from "@tsed/common";

@Configuration({
  logger: {
    requestFields: ["reqId", "method", "url", "headers", "body", "query", "params", "duration"]
  }
})
export class Server {}
```

or you can override the middleware with @@OverrideProvider@@.

Example:

<<< @/docs/snippets/configuration/override-platform-log-middleware.ts

## Shutdown logger

Shutdown returns a Promise that will be resolved when @tsed/logger has closed all appenders and finished writing log events.
Use this when your program exits to make sure all your logs are written to files, sockets are closed, etc.

```typescript
import {$log} from "@tsed/logger";

$log.shutdown().then(() => {
  console.log("Complete");
});
```
