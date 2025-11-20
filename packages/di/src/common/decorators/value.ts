import {catchError} from "@tsed/core/utils/catchError.js";

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
 * Inject a reactive configuration value into a property.
 *
 * Creates a getter/setter that always reflects the current configuration value.
 * Unlike `@Constant()`, the value is not frozen and can change at runtime.
 *
 * ### Usage
 *
 * ```typescript
 * import {Injectable, Value} from "@tsed/di";
 *
 * @Injectable()
 * export class MyService {
 *   @Value("swagger.path")
 *   swaggerPath: string;
 *
 *   @Value("api.port", 3000)
 *   port: number;
 *
 *   constructor() {
 *     // Not available yet - undefined
 *   }
 *
 *   $onInit() {
 *     console.log(this.swaggerPath); // Current value
 *     this.swaggerPath = "/new-path"; // Can be modified
 *   }
 * }
 * ```
 *
 * ### Difference from @Constant
 *
 * - `@Constant`: Frozen immutable value (deep clone)
 * - `@Value`: Reactive value (always reads current config)
 *
 * @param expression Dot-notation path to the configuration value
 * @param defaultValue Optional default value if not found
 * @returns Property decorator function
 * @public
 * @decorator
 */
export function Value(expression: string, defaultValue?: unknown): PropertyDecorator {
  return (target, propertyKey) => {
    return bindValue(target, propertyKey, expression, defaultValue);
  };
}
