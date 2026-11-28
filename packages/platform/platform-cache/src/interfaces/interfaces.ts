import type {Keyv, KeyvStoreAdapter} from "keyv";
import type {BaseContext} from "@tsed/di";
import type {CacheManager, Ttl} from "../services/PlatformCache.js";

/**
 * A cache store accepted by `@tsed/platform-cache`:
 *
 * - `"memory"`: in-memory store (bounded by the `max` setting when given),
 * - a `Keyv` instance, used as is,
 * - a Keyv store adapter (`@keyv/redis`, `RedisKeyvAdapter` from `@tsed/redis`, `IORedisKeyvAdapter` from `@tsed/ioredis`...),
 *   wrapped in a `Keyv` instance without key prefix.
 */
export type PlatformCacheStore = "memory" | Keyv | KeyvStoreAdapter;

export interface PlatformCacheSettings {
  /**
   * Default time to live of the cached entries, in milliseconds.
   */
  ttl?: Ttl;
  /**
   * Remaining time to live (in milliseconds) under which a cached entry is refreshed in background.
   */
  refreshThreshold?: number;
  /**
   * Don't wait for the secondary stores (multi-tier cache) to answer. See cache-manager `nonBlocking` option.
   */
  nonBlocking?: boolean;
  /**
   * Identifier of the cache instance. See cache-manager `cacheId` option.
   */
  cacheId?: string;
  /**
   * Store of the cache. Default: `"memory"`.
   */
  store?: PlatformCacheStore;
  /**
   * Stores of a multi-tier cache, the first one being the primary store. Takes precedence over `store`.
   */
  stores?: PlatformCacheStore[];
  /**
   * Maximum number of entries of the `"memory"` store (least recently used entries are evicted first).
   */
  max?: number;
  keyResolver?: (args: any[], ctx: BaseContext) => string;
  prefix?: string;
  /**
   * List of headers to ignore when caching the response. Default: ["content-length", "x-request-id", "cache-control", "vary", "content-encoding"]
   */
  ignoreHeaders?: string[];
}

declare global {
  namespace TsED {
    interface Configuration {
      cache?: PlatformCacheSettings | false;
    }
  }
}

export interface OnCreateCacheManager {
  $onCreateCacheManager(cache: CacheManager): void | Promise<void>;
}
