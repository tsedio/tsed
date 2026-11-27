import type {DIContext} from "@tsed/di";

export type AlterLogCallback = (
  level: "debug" | "info" | "warn" | "error" | "all",
  obj: Record<string, unknown>,
  ctx: DIContext
) => Record<string, unknown>;

export interface PlatformLogRequestSettings {
  /**
   * Log all incoming requests. By default, true.
   */
  logRequest?: boolean;
  /**
   * A function to alter the log object before it's logged.
   */
  alterLog?: AlterLogCallback;
  /**
   * A function to log the server response.
   */
  onLogResponse?: ($ctx: DIContext) => void;
}

declare global {
  namespace TsED {
    interface LoggerConfiguration extends Partial<PlatformLogRequestSettings> {}
  }
}
