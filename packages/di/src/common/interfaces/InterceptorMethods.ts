import type {InterceptorContext, InterceptorNext} from "./InterceptorContext.js";

/**
 * Interface for implementing method interceptors.
 *
 * Interceptors can modify method behavior, add logging, handle errors, or implement cross-cutting concerns.
 * Classes decorated with `@Interceptor()` must implement this interface.
 *
 * ### Usage
 *
 * ```typescript
 * import {Interceptor, InterceptorContext, InterceptorMethods} from "@tsed/di";
 *
 * @Interceptor()
 * class CacheInterceptor implements InterceptorMethods {
 *   intercept(context: InterceptorContext) {
 *     const cacheKey = `${context.propertyKey.toString()}:${JSON.stringify(context.args)}`;
 *     if (cache.has(cacheKey)) {
 *       return cache.get(cacheKey);
 *     }
 *     const result = context.next();
 *     cache.set(cacheKey, result);
 *     return result;
 *   }
 * }
 * ```
 *
 * @public
 */
export interface InterceptorMethods {
  intercept(context: InterceptorContext, next?: InterceptorNext): any;
}
