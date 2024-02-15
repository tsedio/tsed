export interface DILoggerOptions {
  /**
   * Enable debug mode. By default debug is false.
   */
  debug?: boolean;
  /**
   * Enable info mode. By default debug is false.
   */
  level?: "debug" | "info" | "warn" | "error" | "off";
  /**
   * Enable log performance tracker and disable log server.
   */
  perf?: boolean;
  /**
   * List of regexp to ignore log.
   */
  ignoreUrlPatterns?: (string | RegExp)[];
  /**
   * The number of space characters to use as white space in JSON output. Default is 2 (0 in production).
   */
  jsonIndentation?: number;
  /**
   * A function called for each incoming request to create a request id.
   * @returns {number}
   */
  reqIdBuilder?: (req: any) => string;
  /**
   * Disable routes table displayed in the logger. By default debug is `false`.
   */
  disableRoutesSummary?: boolean;
  /**
   * Disable bootstrap log displayed in the logger. By default debug is `false`.
   */
  disableBootstrapLog?: boolean;
  /**
   * Specify log format. Example: `%[%d{[yyyy-MM-dd hh:mm:ss,SSS}] %p%] %m`. See [@tsed/logger configuration](https://tsedio.github.io/logger/).
   */
  format?: string;
  /**
   * Specify the log stack size for the context.logger. When the stack.length is reach, the logger is flushed during the request.
   * Default size is set to 30.
   */
  maxStackSize?: number;
}

declare global {
  namespace TsED {
    interface LoggerConfiguration extends DILoggerOptions {}

    interface Configuration extends Record<string, any> {
      logger?: LoggerConfiguration;
    }
  }
}
