import {prototypeOf} from "@tsed/core";
import {InjectorService} from "../services/InjectorService";

/**
 * Return value from Configuration.
 *
 * ## Example
 *
 * ```typescript
 * import {Env} from "@tsed/core";
 * import {Constant, Value} from "@tsed/di";
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
    Object.defineProperty(prototypeOf(target), propertyKey, {
      get() {
        return (this.$$injector as InjectorService).settings.get(expression, defaultValue);
      },
      set(value: any) {
        (this.$$injector as InjectorService).settings.set(expression, value);
      },
      enumerable: true,
      configurable: true
    });
  };
}
