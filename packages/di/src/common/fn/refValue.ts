import {injector} from "./injector.js";

/**
 * Get a value from the `injector.settings`.
 *
 * ## Example
 *
 * ```ts
 * import {refValue, Injectable} from "@tsed/di";
 *
 * @Injectable()
 * class Test {
 *   test = refValue("logger.level", "default value");
 *
 *   constructor() {
 *     console.log(this.test.value); // "off"
 *   }
 * }
 *
 * @param expression The expression to get the value from the `injector.settings`.
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
