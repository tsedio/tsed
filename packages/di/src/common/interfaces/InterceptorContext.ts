import type {Type} from "@tsed/core";

/**
 * Function signature for proceeding to the next interceptor or method.
 *
 * Call this function in an interceptor to continue the interceptor chain.
 * Pass an error to short-circuit execution and propagate the error.
 *
 * @typeParam T - The return type of the intercepted method
 * @public
 */
export interface InterceptorNext {
  <T>(err?: Error): T;
}

/**
 * Context object passed to interceptors during method execution.
 *
 * Provides access to the target instance, method name, arguments, and control flow
 * for intercepting and modifying method behavior.
 *
 * ### Usage
 *
 * ```typescript
 * import {Interceptor, InterceptorContext, InterceptorMethods} from "@tsed/di";
 *
 * @Interceptor()
 * class LogInterceptor implements InterceptorMethods {
 *   intercept(context: InterceptorContext) {
 *     console.log("Before:", context.propertyKey);
 *     const result = context.next();
 *     console.log("After:", result);
 *     return result;
 *   }
 * }
 * ```
 *
 * @typeParam Klass - The type of the target class
 * @typeParam Opts - The type of interceptor options
 * @public
 */
export interface InterceptorContext<Klass = Type, Opts = any> {
  target: Klass;
  propertyKey: string | symbol;
  args: unknown[];
  next: InterceptorNext;
  options?: Opts;
}
