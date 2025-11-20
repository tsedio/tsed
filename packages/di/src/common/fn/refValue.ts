import {injector} from "./injector.js";

/**
 * Create a reactive reference to a configuration value.
 *
 * Returns an object with a `value` getter that always fetches the current configuration value.
 * Useful for creating properties that stay synchronized with configuration changes.
 *
 * ### Usage
 *
 * ```typescript
 * import {refValue, Injectable} from "@tsed/di";
 *
 * @Injectable()
 * class Test {
 *   logLevel = refValue<string>("logger.level", "info");
 *   port = refValue<number>("server.port");
 *
 *   constructor() {
 *     console.log(this.logLevel.value); // Always current value
 *   }
 * }
 * ```
 *
 * @typeParam Type The expected type of the value
 * @param expression Dot-notation path to the configuration value
 * @param defaultValue Optional default value if the expression is not found
 * @returns A frozen object with a reactive `value` property
 * @public
 */
export function refValue<Type>(expression: string): {value: Type | undefined};
export function refValue<Type>(expression: string, defaultValue: Type | undefined): {value: Type};
export function refValue<Type>(expression: string, defaultValue?: Type | undefined): {value: Type | undefined} {
  return Object.freeze({
    get value() {
      return injector().settings.get(expression, defaultValue);
    },
    set value(value: Type) {
      injector().settings.set(expression, value);
    }
  });
}
