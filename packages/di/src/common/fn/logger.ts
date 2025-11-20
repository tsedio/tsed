import {injector} from "./injector.js";

/**
 * Get the current logger instance from the injector.
 *
 * Returns the configured logger (defaults to console if not set).
 *
 * ### Usage
 *
 * ```typescript
 * import {logger} from "@tsed/di";
 *
 * logger().info("Application started");
 * logger().error("An error occurred", error);
 * ```
 *
 * @returns The logger instance
 * @public
 */
export function logger() {
  return injector().logger;
}
