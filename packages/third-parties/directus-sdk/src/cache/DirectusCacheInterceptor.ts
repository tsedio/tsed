import type {Type} from "@tsed/core";
import {classOf} from "@tsed/core/utils/classOf.js";
import {nameOf} from "@tsed/core/utils/nameOf.js";
import {bindIntercept, injectable, type InterceptorContext, type InterceptorMethods} from "@tsed/di";
import {snakeCase} from "change-case";

/**
 * Configuration options for the DirectusCacheInterceptor.
 *
 * @property ttl - Time to live in milliseconds for cached values (default: 900000ms = 15 minutes)
 * @property keyGenerator - Custom function to generate cache keys from method arguments
 * @property namespace - Custom namespace for cache keys (default: className:methodName)
 * @property useSystemCache - Whether to use Directus system cache (true) or regular cache (false). Default: true
 */
export type DirectusCacheOptions = {
  ttl?: number;
  keyGenerator?: (...args: any[]) => string;
  namespace?: string;
  useSystemCache?: boolean;
};

/**
 * Default cache key generator that serializes method arguments into a cache key.
 *
 * Creates a JSON string of the arguments, or an empty string if no arguments.
 * This ensures unique cache keys for different argument combinations.
 *
 * @param args - The method arguments to serialize
 * @returns A string representation of the arguments, prefixed with ':'
 *
 * @example
 * ```ts
 * defaultKeyGenerator("user", 123)
 * // Returns: ':["user",123]'
 *
 * defaultKeyGenerator()
 * // Returns: ':'
 * ```
 */
function defaultKeyGenerator(...args: unknown[]): string {
  return args.length > 0 ? JSON.stringify(args) : "";
}

/**
 * Interceptor that provides caching functionality using Directus cache infrastructure.
 *
 * This interceptor wraps method calls to cache their results based on method arguments.
 * It integrates with Directus's built-in caching system and supports both system cache
 * and regular cache.
 *
 * Features:
 * - Automatic cache key generation based on class name, method name, and arguments
 * - Configurable TTL (time to live) for cached values
 * - Custom key generators for complex caching strategies
 * - Support for both system cache and regular cache
 * - Proper handling of falsy values (null, false, 0, empty string)
 *
 * ### Direct usage with bindIntercept
 *
 * ```ts
 * import {DirectusCacheInterceptor, useDirectusCache} from "@tsed/directus-sdk";
 * import {injectable} from "@tsed/di";
 *
 * export class MyService {
 *   search(query: string) {
 *     // Expensive operation
 *     return this.performSearch(query);
 *   }
 * }
 *
 * // Apply cache programmatically
 * injectable(MyService);
 * useDirectusCache(MyService, "search", { ttl: 60000 });
 * ```
 * @remarks
 * This interceptor is typically used via the `@Cache` decorator rather than directly.
 * The cache key format is: `{namespace}:{keyGenerator(...args)}`
 * where namespace defaults to `snake_case_class_name:methodName`
 *
 * @see {@link Cache} decorator for the recommended usage
 * @see {@link useDirectusCache} for programmatic cache binding
 */
export class DirectusCacheInterceptor implements InterceptorMethods {
  /**
   * Intercepts a method call to provide caching functionality.
   *
   * The interception flow:
   * 1. Extract cache options from the context
   * 2. Generate a cache key based on class name, method name, and arguments
   * 3. Check if a cached value exists
   * 4. If cached, return the cached value (skipping method execution)
   * 5. If not cached, execute the method
   * 6. Store the result in cache with the specified TTL
   * 7. Return the result
   *
   * ### Cache key generation
   *
   * ```ts
   * // For class MyService with method search("query")
   * // Default namespace: "my_service:search"
   * // Full cache key: "my_service:search:["query"]"
   * ```
   * @param context - The interceptor context containing method information and options
   *
   * @returns The cached or newly computed result of the method call
   *
   * @remarks
   * - The cache check uses strict inequality (`!== undefined`) to allow caching falsy values
   * - Cache keys are automatically namespaced to avoid collisions between different methods
   * - The system cache is used by default, which persists across requests
   */
  async intercept(context: InterceptorContext<unknown, DirectusCacheOptions>) {
    const {getCache, getCacheValue, setCacheValue} = await import("@directus/api/cache");
    const {
      ttl = 900000, // 15 minutes default
      keyGenerator = defaultKeyGenerator,
      namespace = snakeCase(nameOf(context.target)) + ":" + String(context.propertyKey),
      useSystemCache = true
    } = context.options || {};

    // Get appropriate cache instance
    const cache = getCache();
    const cacheInstance = useSystemCache ? cache.systemCache : cache.cache;

    // Generate cache key
    const cacheKey = `${namespace}:${keyGenerator(...context.args)}`;

    // Try to get from cache
    const cachedValue = await getCacheValue(cacheInstance as any, cacheKey);

    if (cachedValue !== undefined) {
      return cachedValue;
    }

    // Execute function and cache result
    const result = await context.next();

    await setCacheValue(cacheInstance as any, cacheKey, result as Record<string, any>, ttl);

    return result;
  }
}

injectable(DirectusCacheInterceptor);

/**
 * Programmatically applies cache interception to a method using Directus cache infrastructure.
 *
 * This function allows you to add caching to a method after the class is defined,
 * which is useful when you can't use decorators or need dynamic cache configuration.
 *
 * @example Basic usage
 *
 * ```ts
 * import {injectable} from "@tsed/di";
 * import {useDirectusCache} from "@tsed/directus-sdk";
 *
 * export class JiraIssueClient {
 *   search(query: string) {
 *     // Expensive search operation
 *     return this.performSearch(query);
 *   }
 * }
 *
 * injectable(JiraIssueClient)
 *
 * // Apply cache after class definition
 * useDirectusCache(JiraIssueClient, "search", { ttl: 900000 });
 * ```
 *
 * ### With custom options
 * ```ts
 *
 * useDirectusCache(MyService, "fetchData", {
 *   ttl: 60000,
 *   keyGenerator: (id: string) => `data:${id}`,
 *   namespace: "my_service:data",
 *   useSystemCache: false
 * });
 * ```
 *
 * ### Applying cache to multiple methods
 *
 * ```ts
 * import {injectable} from "@tsed/di";
 * import {useDirectusCache} from "@tsed/directus-sdk";
 *
 * export class ApiClient {
 *   getUser(id: string) { }
 *   getPosts() { }
 * }
 * injectable(ApiClient);
 *
 * useDirectusCache(ApiClient, "getUser", { ttl: 300000 });
 * useDirectusCache(ApiClient, "getPosts", { ttl: 60000 });
 * ```
 *
 * @template K - The class type
 * @template Props - The property key type (method name)
 *
 * @param token - The class constructor to apply caching to
 * @param propertyKey - The name of the method to cache
 * @param opts - Cache configuration options
 *
 * @remarks
 * - Must be called after the class is marked as `@Injectable()` or `injectable()`
 * - The class must be registered in the DI container
 * - Prefer using the `@Cache` decorator when possible for better readability
 *
 * @see {@link Cache} decorator for the declarative approach
 * @see {@link DirectusCacheInterceptor} for implementation details
 */
export function useDirectusCache<K, Props = keyof K>(token: Type<K>, propertyKey: Props, opts: DirectusCacheOptions) {
  bindIntercept(classOf(token), propertyKey as string, DirectusCacheInterceptor, opts);
}
