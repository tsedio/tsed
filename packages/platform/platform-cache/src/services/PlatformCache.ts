import {type Cache, createCache} from "cache-manager";
import {Keyv} from "keyv";
import {JsonDeserializerOptions, deserialize, serialize} from "@tsed/json-mapper";
import {ProviderScope, ProviderType, constant, injectable, logger} from "@tsed/di";
import {Type, isClass, isFunction} from "@tsed/core";
import {$asyncEmit} from "@tsed/hooks";
import {AsyncLocalStorage} from "node:async_hooks";
import type {PlatformCacheSettings, PlatformCacheStore} from "../interfaces/interfaces.js";
import {PlatformCachedObject} from "../interfaces/PlatformCachedObject.js";
import {getPrefix} from "../utils/getPrefix.js";
import {LruMap} from "../utils/LruMap.js";

const defaultKeyResolver = (args: any[]) => {
  return args.map((arg: any) => (isClass(arg) ? JSON.stringify(serialize(arg)) : arg)).join(":");
};

/**
 * The cache-manager v7 cache created by `PlatformCache`.
 */
export type CacheManager = Cache;
/**
 * Time to live in seconds, or a function returning it from the cached value.
 */
export type Ttl = number | ((result: any) => number);

/**
 * Options of `PlatformCache.set()`.
 */
export interface PlatformCacheSetOptions {
  /**
   * Time to live in seconds. `null` disables the expiration.
   */
  ttl?: number | null;
}

/**
 * Converts a Ts.ED TTL (seconds) to a cache-manager/Keyv TTL (milliseconds).
 * `undefined` keeps the default TTL, `null` disables the expiration (`0` for Keyv).
 */
const toMs = (seconds: number | null | undefined) => (seconds === undefined ? undefined : seconds === null ? 0 : seconds * 1000);

const storage: AsyncLocalStorage<{forceRefresh: boolean}> = new AsyncLocalStorage();

/**
 * @platform
 */
export class PlatformCache {
  #cache: CacheManager | undefined;

  get cache() {
    return this.#cache;
  }

  async $onInit() {
    const settings = constant<PlatformCacheSettings>("cache");

    if (settings) {
      this.#cache = await this.createCacheManager(settings);

      await $asyncEmit("$onCreateCacheManager", [this.#cache]);
    }
  }

  getKeysOf(target: Type<any>, propertyKey: string | symbol) {
    return this.keys(this.buildEntryPattern(target, propertyKey));
  }

  /**
   * Returns the global cache key prefix from settings (`cache.prefix`).
   */
  cachePrefix() {
    return constant<string>("cache.prefix", "");
  }

  /**
   * Builds the stable namespace segments used by cached entries for a method.
   * The namespace combines the global cache prefix (if configured) and the method prefix.
   */
  buildNamespace(target: Type<any>, propertyKey: string | symbol) {
    return [this.cachePrefix(), ...getPrefix(target, propertyKey)].filter(Boolean);
  }

  /**
   * Builds the final cache key for a method call.
   */
  buildEntryKey(target: Type<any>, propertyKey: string | symbol, keyArgs: string) {
    return [...this.buildNamespace(target, propertyKey), keyArgs].join(":");
  }

  /**
   * Builds a key pattern scoped to a cached method namespace.
   * Useful for listing/invalidation of keys produced by the same cached method.
   */
  buildEntryPattern(target: Type<any>, propertyKey: string | symbol, suffix = "*") {
    return [...this.buildNamespace(target, propertyKey), suffix].join(":");
  }

  /**
   * Builds internal keys used by cache housekeeping features
   * (refresh queue and refresh cooldown markers).
   */
  buildInternalKey(namespace: "queue" | "refresh-cooldown", key: string) {
    return `$$${namespace}:${key}`;
  }

  disabled(): boolean {
    return !constant<PlatformCacheSettings>("cache");
  }

  defaultKeyResolver() {
    return constant<(args: any[], ctx?: any) => string>("cache.keyResolver", defaultKeyResolver);
  }

  defaultTtl() {
    return constant<Ttl>("cache.ttl");
  }

  calculateTTL(result?: any, currentTtl?: Ttl): number | undefined {
    const ttl = currentTtl === undefined ? this.defaultTtl() : currentTtl;

    return isFunction(ttl) ? ttl(result) : ttl;
  }

  /**
   * Returns the remaining time to live of the key, in seconds, or `undefined` when the key is missing or never expires.
   */
  async ttl(key: string): Promise<number | undefined> {
    const expires = await this.cache?.ttl(key);

    if (expires === undefined) {
      return undefined;
    }

    return Math.max(0, (expires - Date.now()) / 1000);
  }

  /**
   * Returns the cached value of the key, or calls `fetch` and caches its result.
   * @param key
   * @param fetch
   * @param ttl time to live in seconds
   */
  wrap<T>(key: string, fetch: () => Promise<T>, ttl?: number): Promise<T> {
    if (!this.cache) {
      return fetch();
    }

    return this.cache.wrap<T>(key, fetch, toMs(ttl));
  }

  async get<T>(key: string, options: JsonDeserializerOptions = {}): Promise<T | undefined> {
    return deserialize(await this.cache?.get<T>(key), options);
  }

  async set<T>(key: string, value: any, options?: PlatformCacheSetOptions): Promise<T | undefined> {
    await this.cache?.set(key, value, toMs(options?.ttl));
    return;
  }

  async getCachedObject(key: string) {
    try {
      return await this.get<PlatformCachedObject>(key);
    } catch (er: any) {
      logger().error({
        event: "CACHE_ERROR",
        method: "getCachedObject",
        error_name: er.name,
        error_message: er.message,
        error_stack: er.stack
      });
    }
  }

  async setCachedObject(key: string, data: any, opts: {ttl?: number} & Record<string, any>) {
    try {
      const {ttl, ...rest} = opts;

      await this.set<PlatformCachedObject>(
        key,
        {
          ...rest,
          ...(ttl !== undefined && {ttl}),
          data: JSON.stringify(data)
        },
        ttl !== undefined ? {ttl} : undefined
      );
    } catch (er) {
      logger().error({
        event: "CACHE_ERROR",
        method: "setCachedObject",
        error_name: (er as Error).name,
        error_message: (er as Error).message,
        error_stack: (er as Error).stack
      });
    }
  }

  async del(key: string): Promise<void> {
    await this.cache?.del(key);
  }

  /**
   * Clears every store of the cache.
   */
  async reset(): Promise<void> {
    await this.cache?.clear();
  }

  /**
   * Lists the keys of the primary store (first store), filtered by the glob `pattern` when given.
   *
   * Uses the `keys(pattern)` method of the store adapter when it has one (`RedisKeyvAdapter`, `IORedisKeyvAdapter`),
   * otherwise the Keyv iterator (memory store, `@keyv/redis`...). Returns an empty list when the store can't list its keys.
   */
  async keys(pattern?: string): Promise<string[]> {
    const keyv = this.cache?.stores[0];

    if (!keyv) {
      return [];
    }

    const adapter = keyv.store as {keys?: (pattern?: string) => Promise<string[]>};

    // a Map store (memory) has its own keys() method returning an iterator: use the Keyv iterator instead
    if (!(adapter instanceof Map) && isFunction(adapter?.keys)) {
      return adapter.keys(pattern);
    }

    if (!isFunction(keyv.iterator)) {
      return [];
    }

    const keys: string[] = [];

    for await (const [key] of keyv.iterator(undefined)) {
      keys.push(key as string);
    }

    if (!pattern) {
      return keys;
    }

    const {default: micromatch} = await import("micromatch");

    return micromatch(keys, pattern);
  }

  async deleteKeys(patterns: string): Promise<string[]> {
    const keys = await this.keys(patterns);

    await Promise.all(keys.map((key: string) => this.del(key)));

    return keys;
  }

  /**
   * Use micromatch instead native patterns. Use this method if the native store method doesn't support glob patterns
   * @param patterns
   */
  async getMatchingKeys(patterns: string): Promise<string[]> {
    const [keys, {default: micromatch}] = await Promise.all([this.keys(), import("micromatch")]);

    return micromatch(keys, patterns);
  }

  async deleteMatchingKeys(patterns: string): Promise<string[]> {
    const keys = await this.getMatchingKeys(patterns);

    await Promise.all(keys.map((key: string) => this.del(key)));

    return keys;
  }

  refresh(callback: () => Promise<any> | any) {
    return storage.run({forceRefresh: true}, callback);
  }

  isForceRefresh() {
    return !!storage.getStore()?.forceRefresh;
  }

  protected createCacheManager(settings: PlatformCacheSettings): Cache {
    const {store = "memory", stores = [store], ttl, refreshThreshold, nonBlocking, cacheId, max} = settings;

    return createCache({
      stores: stores.map((store) => this.toKeyv(store, max)),
      ttl: isFunction(ttl) ? undefined : toMs(ttl),
      refreshThreshold: toMs(refreshThreshold),
      nonBlocking,
      cacheId
    });
  }

  private toKeyv(store: PlatformCacheStore, max?: number): Keyv {
    if (store instanceof Keyv) {
      return store;
    }

    if (store === "memory") {
      return new Keyv({store: max ? new LruMap(max) : new Map()});
    }

    return new Keyv({store, useKeyPrefix: false});
  }
}

injectable(PlatformCache).type(ProviderType.MODULE).scope(ProviderScope.SINGLETON);
