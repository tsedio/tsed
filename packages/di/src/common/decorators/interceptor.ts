import {interceptor} from "../fn/injectable.js";

/**
 * Declare an interceptor class for cross-cutting concerns.
 *
 * Registers a class as an interceptor provider that can modify method execution behavior.
 * Interceptors must implement the `InterceptorMethods` interface.
 * All interceptors are singleton-scoped and constructed once.
 *
 * ### Usage
 *
 * ```typescript
 * import {Interceptor, InterceptorContext, InterceptorMethods} from "@tsed/di";
 *
 * @Interceptor()
 * export class LogInterceptor implements InterceptorMethods {
 *   intercept(context: InterceptorContext) {
 *     console.log("Before:", context.propertyKey);
 *     const result = context.next();
 *     console.log("After:", result);
 *     return result;
 *   }
 * }
 *
 * // Use with @Intercept decorator
 * @Injectable()
 * class MyService {
 *   @Intercept(LogInterceptor)
 *   async fetchData() {
 *     return "data";
 *   }
 * }
 * ```
 *
 * @returns Class decorator function
 * @public
 * @decorator
 */
export function Interceptor(): ClassDecorator {
  return (target) => {
    interceptor(target);
  };
}
