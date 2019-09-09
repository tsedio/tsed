import {Store} from "@tsed/core";
import {IInjectableProperties} from "../interfaces/IInjectableProperties";
import {InjectablePropertyType} from "../interfaces/InjectablePropertyType";

/**
 * Return value from Configuration.
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
 *    constructor() {
 *       console.log(this.swaggerPath) // undefined. Not available on constructor
 *    }
 *
 *    $onInit() {
 *      console.log(this.swaggerPath)  // something
 *    }
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
        bindingType: InjectablePropertyType.VALUE,
        propertyKey,
        expression,
        defaultValue
      }
    } as IInjectableProperties);
  };
}
