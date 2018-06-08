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
 *    @Value("swagger.path", "defaultValue")
 *    swaggerPath: string;
 *
 * }
 * ```
 *
 * @param expression
 * @param defaultValue
 * @returns {(targetClass: any, attributeName: string) => any}
 * @decorator
 */
export function Value(expression: any, defaultValue?: any) {
  return (target: any, propertyKey: string) => {
    Store.from(target).merge("injectableProperties", {
      [propertyKey]: {
        bindingType: "value",
        propertyKey,
        expression,
        defaultValue
      }
    } as IInjectableProperties);
  };
}
