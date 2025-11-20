import {Intercept} from "@tsed/di";

import {DirectusCacheInterceptor, type DirectusCacheOptions} from "../services/DirectusCacheInterceptor.js";

/**
 * Decorator to cache method results using Directus cache system.
 *
 * This decorator uses the Directus cache infrastructure (system cache by default) to store
 * method results. Cached values are retrieved on subsequent calls with the same arguments,
 * avoiding redundant computations or API calls.
 *
 * ### Basic usage
 *
 * ```ts
 * import {Injectable} from "@tsed/di";
 * import {Cache} from "@tsed/directus-sdk";
 *
 * @Injectable()
 * export class JiraIssueClient {
 *   // Cache search results for 15 minutes (default TTL)
 *   @Cache({ ttl: 900000 })
 *   search(query: string) {
 *     // Expensive API call
 *     return this.fetchFromJira(query);
 *   }
 *
 *   // Custom cache key generator
 *   @Cache({
 *     ttl: 60000,
 *     keyGenerator: (userId: string) => `user:${userId}`
 *   })
 *   getUserById(userId: string) {
 *     return this.fetchUser(userId);
 *   }
 *
 *   // Use regular cache instead of system cache
 *   @Cache({
 *     ttl: 300000,
 *     useSystemCache: false,
 *     namespace: "custom:namespace"
 *   })
 *   getCustomData() {
 *     return this.fetchCustomData();
 *   }
 * }
 * ```
 *
 * @param options - Cache configuration options
 * @param options.ttl - Time to live in milliseconds (default: 900000ms = 15 minutes)
 * @param options.keyGenerator - Custom function to generate cache keys from method arguments
 * @param options.namespace - Custom namespace for cache keys (default: className:methodName)
 * @param options.useSystemCache - Whether to use system cache (true) or regular cache (false). Default: true
 *
 * @returns A method decorator that intercepts method calls and caches results
 *
 * @decorator
 * @see {@link DirectusCacheInterceptor} for implementation details
 * @see {@link DirectusCacheOptions} for available options
 */
export function Cache(options: DirectusCacheOptions) {
  return Intercept(DirectusCacheInterceptor, options);
}
