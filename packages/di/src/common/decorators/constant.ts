import {catchError} from "@tsed/core/utils/catchError.js";
import {deepClone} from "@tsed/core/utils/deepClone.js";

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
 * Inject a frozen configuration value into a property.
 *
 * Retrieves a value from the injector configuration and freezes it (creates an immutable deep clone).
 * The value is lazily loaded on first access and cached for subsequent accesses.
 *
 * ### Usage
 *
 * ```typescript
 * import {Injectable, Constant} from "@tsed/di";
 * import {Env} from "@tsed/core";
 *
 * @Injectable()
 * export class MyService {
 *   @Constant("env")
 *   env: Env;
 *
 *   @Constant("api.baseUrl")
 *   apiUrl: string;
 *
 *   @Constant("api.timeout", 5000)
 *   timeout: number;
 *
 *   constructor() {
 *     // Not available yet - undefined
 *   }
 *
 *   $onInit() {
 *     console.log(this.env); // Value is available
 *   }
 * }
 * ```
 *
 * @typeParam Type The expected type of the constant value
 * @param expression Dot-notation path to the configuration value
 * @param defaultValue Optional default value if not found
 * @returns Property decorator function
 * @public
 */
export function Constant<Type = unknown>(expression: string, defaultValue?: Type): PropertyDecorator {
  return (target, propertyKey) => {
    return bindConstant(target, propertyKey, expression, defaultValue);
  };
}
