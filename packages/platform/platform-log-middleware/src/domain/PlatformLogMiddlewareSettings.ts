export type LoggerRequestFields = ("reqId" | "method" | "url" | "headers" | "body" | "query" | "params" | "duration" | string)[];

export interface PlatformLogMiddlewareSettings {
  /**
   * Fields displayed when a request is logged. Possible values: `reqId`, `method`, `url`, `headers`, `body`, `query`,`params`, `duration`.
   */
  requestFields?: LoggerRequestFields;
  /**
   * Log all incoming request. By default, is true and print the configured `logger.requestFields`.
   */
  logRequest?: boolean;
  /**
   * Log start of all incoming request. By default, is false
   */
  logStart?: boolean;
  /**
   * Log end of all incoming request. By default, is true
   */
  logEnd?: boolean;
}

declare global {
  namespace TsED {
    interface LoggerConfiguration extends Partial<PlatformLogMiddlewareSettings> {}
  }
}
