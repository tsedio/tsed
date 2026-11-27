# Appenders and layouts reference (@tsed/logger v8)

Live documentation: https://logger.tsed.dev/appenders.md and https://logger.tsed.dev/layouts.md. Each page has a `.md` twin; the index is https://logger.tsed.dev/llms.txt.

## Appender configuration

```typescript
$log.appenders.set(name, {type, levels, layout, options, ...appenderSpecificKeys});
```

| Key       | Meaning                                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `name`    | Key of the appender on this logger. Setting an existing name replaces the appender.                               |
| `type`    | Registered appender name (string) or the appender class.                                                          |
| `levels`  | Array of level names (case-insensitive) this appender accepts. Omitted: all levels.                               |
| `layout`  | `{type, ...layoutOptions}`. Default: `colored`, unless the appender declares another default (file uses `basic`). |
| `options` | Connector-specific settings.                                                                                      |

Other methods: `$log.appenders.has(name)`, `.get(name)`, `.delete(name)`, `.clear()`.

Levels, lowest to highest: `trace`, `debug`, `info`, `warn`, `error`, `fatal`. `$log.level` is the global threshold (`all` and `off` are also valid); appender `levels` then filter per output.

The documentation pages of several appenders and layouts show `level: ["debug", "info"]`. That key is not read: use `levels`.

## Appenders

| `type`                | Class                  | Package                      | Notes                                                                                  |
| --------------------- | ---------------------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| `console`             | `ConsoleAppender`      | `@tsed/logger`               | Built in. Writes everything with `console.log`.                                        |
| `stdout`              | `StdoutAppender`       | `@tsed/logger-std`           | `process.stdout.write`. Importing the package sets `stdout` and `stderr` on `$log`.    |
| `stderr`              | `StderrAppender`       | `@tsed/logger-std`           | `process.stderr.write`.                                                                |
| `file`                | `FileAppender`         | `@tsed/logger-file`          | Top-level `filename`, `maxLogSize`, `backups`, `pattern` (date rolling), `compress`.   |
| `logstash-http`       | `LogStashHttpAppender` | `@tsed/logger-logstash-http` | `options`: `url`, `application`, `logType`, `logChannel`, `bufferMax`, `delayToFlush`. |
| `logstash-http` (sic) | `LogStashUdpAppender`  | `@tsed/logger-logstash-udp`  | `options`: `host`, `port`, `extraDataProvider`. Pass the class as `type`.              |
| `seq`                 | `SeqAppender`          | `@tsed/logger-seq`           | `options`: `serverUrl`, `apiKey`.                                                      |
| `loggly`              | `LogglyAppender`       | `@tsed/logger-loggly`        | `options`: `token`, `subdomain`, `tags`.                                               |
| `slack`               | `SlackAppender`        | `@tsed/logger-slack`         | `options`: `token`, `channel_id`, `username`, `icon_url`.                              |
| `rabbitmq`            | `RabbitMQAppender`     | `@tsed/logger-rabbitmq`      | `options`: `host`, `port`, `username`, `password`, `exchange`, `routing_key`, ...      |
| `smtp`                | `SmtpAppender`         | `@tsed/logger-smtp`          | Top-level `recipients`, `sendInterval`, `attachment`, `shutdownTimeout`.               |
| `insight`             | `InsightAppender`      | `@tsed/logger-insight`       | `options`: `token`, `region`.                                                          |
| `logentries`          | `LogEntriesAppender`   | `@tsed/logger-logentries`    | `options`: `token`.                                                                    |
| `connect`             | `ConnectAppender`      | `@tsed/logger-connect`       | `options.logger`: forward events to another logger object. Default layout `object`.    |

Rules:

- Import the package before `appenders.set()`. An unregistered `type` prints a warning and becomes a console appender.
- Passing the class (`type: SeqAppender`) resolves to the class's registered name; it forces the import to exist.
- Open the appender's page (`https://logger.tsed.dev/appenders/<name>.md`) for the full option list before configuring it.

## Layouts

| `type`               | Import                                             | Output                                                        |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| `colored`            | none (always registered)                           | Timestamp, level and category, colored by level.              |
| `basic`              | `@tsed/logger/layouts/BasicLayout.js`              | Same as colored without colors.                               |
| `json`               | `@tsed/logger/layouts/JsonLayout.js`               | One JSON object per event. Option `separator`.                |
| `messagePassThrough` | `@tsed/logger/layouts/MessagePassThroughLayout.js` | Only the message.                                             |
| `dummy`              | `@tsed/logger/layouts/DummyLayout.js`              | The first logged value, untouched.                            |
| `object`             | `@tsed/logger/layouts/ObjectLayout.js`             | A plain object (for appenders that send structured data).     |
| `pattern`            | `@tsed/logger-pattern-layout` (separate package)   | Format string: `{type: "pattern", pattern: "%d %p %c %m%n"}`. |

Pattern tokens: `%d` date, `%p` level, `%c` category, `%m` message, `%j` data as JSON, `%h` hostname, `%z` pid, `%n` newline, `%[` ... `%]` colored block, `%x{token}` user token, `%X{key}` logger context value. Details: https://logger.tsed.dev/layouts/pattern.md.

JSON layout output shape: `startTime`, `categoryName`, `level`, the keys of `$log.context`, the keys of every logged object, and `data` (array of the logged non-object values).

## JSON logs in production

```typescript
// src/config/logger.ts - import this file first in the entry point
import {$log} from "@tsed/logger";
import "@tsed/logger-std";
import "@tsed/logger/layouts/JsonLayout.js";

export const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  $log.appenders
    .set("stdout", {type: "stdout", levels: ["info", "debug"], layout: {type: "json"}})
    .set("stderr", {type: "stderr", levels: ["trace", "fatal", "error", "warn"], layout: {type: "json"}});
}
```

Add `logger: {disableRoutesSummary: isProduction}` to `@Configuration` so the routes table is not printed as one multi-line event. Do not set `logger.format` together with this: it replaces both appenders with the pattern layout during bootstrap.

## Custom appender

```typescript
import {Appender, BaseAppender, LogEvent} from "@tsed/logger";

interface AuditOptions {
  endpoint: string;
}

@Appender({name: "audit"})
export class AuditAppender extends BaseAppender<AuditOptions> {
  private queue: string[] = [];

  build() {
    // optional: called once after construction; open connections here
  }

  write(loggingEvent: LogEvent) {
    this.queue.push(this.layout(loggingEvent, this.config.timezoneOffset));
  }

  async shutdown() {
    // optional: awaited by logger.shutdown(); flush this.queue to this.config.options.endpoint
  }
}
```

```typescript
import {$log} from "@tsed/logger";
import {AuditAppender} from "./AuditAppender.js";

$log.appenders.set("audit", {type: AuditAppender, levels: ["warn", "error"], options: {endpoint: "https://audit.local"}});
```

- `write()` is synchronous and called for every accepted event; never throw from it and never `await` inside it. Buffer and flush in the background.
- `@Appender({name, defaultLayout})` sets the layout used when the configuration has none. The functional form is `appender("audit", AuditAppender)`.
- An appender is not a Ts.ED provider: `inject()` is not available in its constructor. Pass dependencies through `options`.

## Custom layout

```typescript
import {BaseLayout, Layout, LogEvent} from "@tsed/logger";

@Layout({name: "ecs"})
export class EcsLayout extends BaseLayout {
  transform(loggingEvent: LogEvent, timezoneOffset?: number): string {
    return JSON.stringify({
      "@timestamp": loggingEvent.startTime,
      "log.level": loggingEvent.level.toString().toLowerCase(),
      "log.logger": loggingEvent.categoryName,
      ...loggingEvent.context.toJSON(),
      ...loggingEvent.getData(),
      message: loggingEvent.getMessage()?.join(" ")
    });
  }
}
```

Use it with `layout: {type: "ecs"}` after importing the file. `LogEvent` exposes `categoryName`, `level`, `data` (array of logged arguments), `context`, `startTime`, `isMessage()`, `getData()`, `getMessage()`. Layout options are available on `this.config`.

## Shutdown

`await $log.shutdown()` stops the logger and awaits the `shutdown()` of every appender that defines one. Call it once, at process exit.
