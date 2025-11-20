import {injector} from "./injector.js";

/**
 * Get a constant value from the injector configuration settings.
 *
 * Retrieves a configuration value using dot notation path syntax.
 * Useful for accessing environment variables, configuration constants, or settings.
 *
 * ### Usage
 *
 * ```typescript
 * import {constant} from "@tsed/di";
 *
 * const apiKey = constant<string>("api.key");
 * const port = constant<number>("server.port", 3000);
 * const debug = constant<boolean>("logger.debug", false);
 * ```
 *
 * @typeParam Type The expected type of the constant value
 * @param expression Dot-notation path to the configuration value (e.g., "logger.level")
 * @param defaultValue Optional default value if the expression is not found
 * @returns The configuration value or undefined
 * @public
 */
export function constant<Type>(expression: string): Type | undefined;
export function constant<Type>(expression: string, defaultValue: Type | undefined): Type;
export function constant<Type>(expression: string, defaultValue?: Type | undefined): Type | undefined {
  return injector().settings.get(expression, defaultValue);
}
