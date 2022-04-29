import {deepClone, prototypeOf} from "@tsed/core";
import type {InjectorService} from "../services/InjectorService";

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
 * @param {string} expression
 * @param defaultValue
 * @returns {(targetClass: any, attributeName: string) => any}
 * @decorator
 */
export function Constant(expression: string, defaultValue?: any): any {
  return (target: any, propertyKey: string) => {
    Object.defineProperty(prototypeOf(target), propertyKey, {
      get() {
        const injector = this.$$injector as InjectorService;
        const value = injector.settings.get(expression, defaultValue);

        return Object.freeze(deepClone(value));
      },
      enumerable: true,
      configurable: true
    });
  };
}
