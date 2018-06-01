import {Store} from "@tsed/core";
import {IInjectableProperties} from "../../di/interfaces/IInjectableProperties";

/**
 * Return value from ServerSettingsService.
 *
 * ## Example
 *
 * ```typescript
 * import {Env} from "@tsed/core";
 * import {Constant, Value} from "@tsed/common";
 *
 * export class MyClass {
 *
 *    @Constant("env")
 *    env: Env;
 *
 *    @Value("swagger.path")
 *    swaggerPath: string;
 *
 * }
 * ```
 *
 * @param {string} expression
 * @returns {(targetClass: any, attributeName: string) => any}
 * @decorator
 */
export function Constant(expression: string): any {
  return (target: any, propertyKey: string) => {
    Store.from(target).merge("injectableProperties", {
      [propertyKey]: {
        bindingType: "constant",
        propertyKey,
        expression
      }
    } as IInjectableProperties);
  };
}
