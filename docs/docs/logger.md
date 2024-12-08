---
head:
  - - meta
    - name: description
      content: Documentation over Logger by Ts.ED framework.
  - - meta
    - name: keywords
      content: logger decorators ts.ed express.js koa.js typescript node.js javascript
---

# Logger

Ts.ED has its own logger available through [`@tsed/logger`](https://logger.tsed.io) package.

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

- @@ContextLogger@@, in **production** mode, caches all request logs until the response is sent to your consumer.
  See [request logger](/docs/logger.html#request-logger) section bellow.
- [Layouts](https://logger.tsed.io/layouts) support,
- [Appenders](https://logger.tsed.io/appenders) support;

## Configuration

Logger can be configured through the @@Configuration@@ decorator:

<div class="table-features">

| Props                         | Description                                                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logger.level`                | Change the default log level displayed in the terminal. Values: `debug`, `info`, `warn` or `error`. By default: `info`.                                                               |
| `logger.logRequest`           | Log all incoming requests. By default, it's true and prints the configured `logger.requestFields`.                                                                                    |
| `logger.requestFields`        | Fields displayed when a request is logged. Possible values: `reqId`, `method`, `url`, `headers`, `body`, `query`,`params`, `duration`. This option has effect only on the info level. |
| `logger.reqIdBuilder`         | A function called for each incoming request to create a request id.                                                                                                                   |
| `logger.jsonIndentation`      | The number of space characters to use as white space in JSON output. Default is 2 (0 in production).                                                                                  |
| `logger.disableRoutesSummary` | Disable routes table displayed in the logger.                                                                                                                                         |
| `logger.format`               | Specify log format. Example: `%[%d{[yyyy-MM-dd hh:mm:ss,SSS}] %p%] %m`. See [@tsed/logger configuration](https://logger.tsed.io).                                                     |
| `logger.ignoreUrlPatterns`    | (`String` or `RegExp`) List of patterns to ignore logged request according to the `request.url`.                                                                                      |

</div>

::: warning
It's recommended to disable logRequest in production. Logger has a cost on the performance.
:::

## Layouts and Appenders

### Layouts

You can configure a [layout](https://logger.tsed.io/layouts) to format the log output. The following layouts are available:

| Name                                                                       | Description                                                                                                                        |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [Basic layout](https://logger.tsed.io/layouts/basic.html)                  | Basic layout will output the timestamp, level, category, followed by the formatted log event data.                                 |
| [Colored layout](https://logger.tsed.io/layouts/colored.html)              | This layout is the same as basic, except that the timestamp, level and category will be colored according to the log event's level |
| [Dummy layout](https://logger.tsed.io/layouts/dummy.html)                  | This layout only outputs the first value in the log event's data.                                                                  |
| [Message layout](https://logger.tsed.io/layouts/message-pass-through.html) | Use a simple message format to display log                                                                                         |
| [Json layout](https://logger.tsed.io/layouts/json.html)                    | Display log to JSON format                                                                                                         |
| [Pattern layout](https://logger.tsed.io/layouts/pattern.html)              | Use custom pattern to format log                                                                                                   |
| [Custom layout](https://logger.tsed.io/layouts/custom.html)                | logging to stdout or stderr with a custom layout.                                                                                  |

### Appenders

You can configure an [appender](https://logger.tsed.io/appenders) to send log events to a destination.
The following appenders are available:

| Name                                                                 | Description                                                                 |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Connect](https://logger.tsed.io/appenders/connect.html)             | allows connecting Ts.ED logger with another logger.                         |
| [Console](https://logger.tsed.io/appenders/console.html)             | log to the console.                                                         |
| [File](https://logger.tsed.io/appenders/file.html)                   | log to a file.                                                              |
| [File date](https://logger.tsed.io/appenders/file-date.html)         | log to a file with configurable log rolling based on file size or date.     |
| [Stdout](https://logger.tsed.io/appenders/stdout.html)               | log to stdout.                                                              |
| [Stderr](https://logger.tsed.io/appenders/stderr.html)               | log to stderr.                                                              |
| [Insight](https://logger.tsed.io/appenders/insight.html)             | log to [Insight](https://insight.io/).                                      |
| [LogEntries](https://logger.tsed.io/appenders/logentries.html)       | log to [LogEntries](https://logentries.com/).                               |
| [LogStash HTTP](https://logger.tsed.io/appenders/logstash-http.html) | log to [LogStash](https://www.elastic.co/logstash).                         |
| [LogStash UDP](https://logger.tsed.io/appenders/logstash-udp.html)   | log to [LogStash](https://www.elastic.co/logstash).                         |
| [Loggly](https://logger.tsed.io/appenders/loggly.html)               | log to [Loggly](https://www.loggly.com/).                                   |
| [RabbitMQ](https://logger.tsed.io/appenders/rabbitmq.html)           | log to [RabbitMQ](https://www.rabbitmq.com/).                               |
| [Seq](https://logger.tsed.dev/tutorials/seq.html)                    | log to [Seq](https://datalust.co/seq).                                      |
| [Slack](https://logger.tsed.io/appenders/slack.html)                 | log to [Slack](https://slack.com/).                                         |
| [Smtp](https://logger.tsed.io/appenders/smtp.html)                   | log to [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). |

::: tip
You can create your own layout/appender:

- [Customize appender (chanel)](https://logger.tsed.io/appenders/custom.html),
- [Customize layout](https://logger.tsed.io/layouts/custom.html)

:::

## Use Json Layout in production

You add this code to switch the logger to Json layout in production mode:

```typescript
import {env} from "@tsed/core";
import {Configuration} from "@tsed/di";
import {$log} from "@tsed/logger";
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
import {Controller} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {Context} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
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
import {PlatformContext} from "@tsed/platform-http";
import {Injectable, Inject} from "@tsed/di";

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
import {Configuration} from "@tsed/di";

@Configuration({
  logger: {
    requestFields: ["reqId", "method", "url", "headers", "body", "query", "params", "duration"]
  }
})
export class Server {}
```

or you can override the middleware with @@OverrideProvider@@.

Example:

```ts
import {OverrideProvider} from "@tsed/di";
import {Context, PlatformLogMiddleware} from "@tsed/common";

@OverrideProvider(PlatformLogMiddleware)
export class CustomPlatformLogMiddleware extends PlatformLogMiddleware {
  public use(@Context() ctx: Context) {
    // do something

    return super.use(ctx); // required
  }

  protected requestToObject(ctx: Context) {
    const {request} = ctx;

    // NOTE: request => PlatformRequest. To get Express.Request use ctx.getRequest<Express.Request>();
    return {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      query: request.query,
      params: request.params
    };
  }
}
```

Another example to redact some fields:

```typescript
import {Context, OverrideProvider} from "@tsed/di";
import {PlatformLogMiddleware} from "@tsed/platform-log-middleware";

@OverrideProvider(PlatformLogMiddleware)
export class CustomPlatformLogMiddleware extends PlatformLogMiddleware {
  attributesToHide = ["password", "client_secret"];

  private redactAttributes(body: any): any {
    if (body) {
      for (const attribute of this.attributesToHide) {
        if (body[attribute]) {
          body[attribute] = "[REDACTED]";
        }
      }
    }
    return body;
  }

  requestToObject(ctx: Context): any {
    const {request} = ctx;

    return {
      method: request.method,
      url: request.url,
      route: request.route,
      headers: request.headers,
      body: this.redactAttributes(request.body),
      query: request.query,
      params: request.params
    };
  }
}
```

## Shutdown logger

Shutdown returns a Promise that will be resolved when `@tsed/logger has closed all appenders and finished writing log
events.
Use this when your program exits to make sure all your logs are written to files, sockets are closed, etc.

```typescript
import {$log} from "@tsed/logger";

$log.shutdown().then(() => {
  console.log("Complete");
});
```
