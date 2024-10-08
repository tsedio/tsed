import {catchError} from "@tsed/core";

import {injector} from "../fn/injector.js";

export function bindValue(target: any, propertyKey: string | symbol, expression: string, defaultValue?: any) {
  const descriptor = {
    get() {
      return injector().settings.get(expression, defaultValue);
    },
    set(value: unknown) {
      injector().settings.set(expression, value);
    },
    enumerable: true,
    configurable: true
  };

  catchError(() => Reflect.deleteProperty(target, propertyKey));
  catchError(() => Reflect.defineProperty(target, propertyKey, descriptor));
}

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
export function Value(expression: string, defaultValue?: unknown): PropertyDecorator {
  return (target, propertyKey) => {
    return bindValue(target, propertyKey, expression, defaultValue);
  };
}
