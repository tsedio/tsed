export interface ILoggerSettings {
  /**
   * Enable debug mode. By default debug is false.
   */
  debug?: boolean;
  /**
   * Enable info mode. By default debug is false.
   */
  level?: "debug" | "info" | "warn" | "error" | "off";
  /**
   * Fields displayed when a request is logged. Possible values: `reqId`, `method`, `url`, `headers`, `body`, `query`,`params`, `duration`.
   */
  requestFields?: ("reqId" | "method" | "url" | "headers" | "body" | "query" | "params" | "duration")[];
  /**
   * List of regexp to ignore log.
   */
  ignoreUrlPatterns?: string[];
  /**
   * Log all incoming request. By default is true and print the configured `logger.requestFields`.
   */
  logRequest?: boolean;
  /**
   * The number of space characters to use as white space in JSON output. Default is 2 (0 in production).
   */
  jsonIndentation?: number;
  /**
   * A function called for each incoming request to create a request id.
   * @returns {number}
   */
  reqIdBuilder?: () => string;
  /**
   * Disable routes table displayed in the logger. By default debug is `false`.
   */
  disableRoutesSummary?: boolean;
  /**
   * Specify log format. Example: `%[%d{[yyyy-MM-dd hh:mm:ss,SSS}] %p%] %m`. See [ts-log-debug configuration](https://romakita.github.io/ts-log-debug/).
   */
  format?: string;
}
