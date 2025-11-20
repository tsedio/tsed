/**
 * Logger interface for the Dependency Injection system.
 *
 * Defines the contract for logging implementations used throughout Ts.ED's DI framework.
 * Custom logger implementations must conform to this interface to be compatible with the DI system.
 *
 * ### Usage
 *
 * ```typescript
 * import {DILogger} from "@tsed/di";
 *
 * class CustomLogger implements DILogger {
 *   info(...args: any[]) {
 *     console.log("[INFO]", ...args);
 *   }
 *
 *   warn(...args: any[]) {
 *     console.warn("[WARN]", ...args);
 *   }
 *
 *   debug(...args: any[]) {
 *     console.debug("[DEBUG]", ...args);
 *   }
 *
 *   error(...args: any[]) {
 *     console.error("[ERROR]", ...args);
 *   }
 *
 *   trace(...args: any[]) {
 *     console.trace("[TRACE]", ...args);
 *   }
 * }
 * ```
 *
 * @public
 */
export interface DILogger {
  info(...args: any[]): void | any;

  warn(...args: any[]): void | any;

  debug(...args: any[]): void | any;

  error(...args: any[]): void | any;

  trace(...args: any[]): void | any;

  [key: string]: any;
}
