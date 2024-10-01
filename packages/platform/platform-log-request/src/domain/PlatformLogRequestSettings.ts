import type {BaseContext} from "@tsed/di";

export type AlterLogCallback = (
  level: "debug" | "info" | "warn" | "error" | "all",
  obj: Record<string, unknown>,
  ctx: BaseContext
) => Record<string, unknown>;

export interface PlatformLogRequestSettings {
  /**
   * Log all incoming request. By default, is true and print the configured `logger.requestFields`.
   */
  logRequest?: boolean;
  /**
   * A function to alter the log object before it's logged.
   */
  alterLog?: AlterLogCallback;
  /**
   * A function to log the server response.
   */
  onLogResponse?: ($ctx: BaseContext) => void;
}

declare global {
  namespace TsED {
    interface LoggerConfiguration extends Partial<PlatformLogRequestSettings> {}
  }
}
