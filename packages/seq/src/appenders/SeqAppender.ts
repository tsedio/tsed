import {$log, Appender, LogEvent, BaseAppender} from "ts-log-debug";
import {createLogger} from "bunyan";
import {createStream} from "bunyan-seq";

/**
 * ## Seq Output Appender
 *
 * This appender writes all log events to the seq logger stream
 *
 * ## Configuration
 *
 * * type - seq
 * * layout - object (optional, defaults to colouredLayout) - see layouts
 * * url - string - the url to the seq server
 *
 * ## Example
 *
 * ```typescript
 * import {Logger} from "ts-log-debug";
 *
 * const logger = new Logger("loggerName");
 *
 * logger.appenders.set("seq", {
 *     type: "seq",
 *     levels: ["info", "trace", "debug"],
 *     url: "http://localhost:5341"
 * });
 * ```
 *
 * @private
 */
@Appender({name: "seq"})
export class SeqAppender extends BaseAppender {
  private logger: any;

  build() {
    if ($log.level !== "OFF") {
      this.logger = createLogger({
        name: $log.name,
        streams: [
          createStream({
            serverUrl: this.config.url,
            apiKey: this.config.apiKey,
            level: $log.level
          })
        ]
      });
    }
  }

  write(loggingEvent: LogEvent) {
    const level = loggingEvent.level.toString().toLowerCase();

    if (level !== "OFF" && this.logger[level]) {
      const data = loggingEvent.data;
      if (typeof data[0] === "string") {
        data[0] = data[0].replace(/\[1m|\[22m/g, "");
      }
      this.logger[level](...data);
    }
  }
}
