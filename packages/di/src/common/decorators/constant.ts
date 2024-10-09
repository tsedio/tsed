import {catchError, deepClone} from "@tsed/core";

import {constant} from "../fn/constant.js";

export function bindConstant(target: any, propertyKey: string | symbol, expression: string, defaultValue?: any) {
  const symbol = Symbol();

  catchError(() => Reflect.deleteProperty(target, propertyKey));
  Reflect.defineProperty(target, propertyKey, {
    get() {
      if (this[symbol] !== undefined) {
        return this[symbol];
      }

      const value = constant(expression, defaultValue);

      this[symbol] = Object.freeze(deepClone(value));

      return this[symbol];
    },
    set(value: unknown) {
      const bean = constant(expression, defaultValue) || this[symbol];

      if (bean === undefined && value !== undefined) {
        this[symbol] = value;
      }
    },
    enumerable: true,
    configurable: true
  });
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
 * @param {string} expression
 * @param defaultValue
 * @returns {(targetClass: any, attributeName: string) => any}
 * @decorator
 */
export function Constant<Type = unknown>(expression: string, defaultValue?: Type): PropertyDecorator {
  return (target, propertyKey) => {
    return bindConstant(target, propertyKey, expression, defaultValue);
  };
}
