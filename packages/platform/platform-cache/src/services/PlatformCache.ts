import {isClass, isFunction, isString, Type} from "@tsed/core";
import {Configuration, Inject, InjectorService, Module} from "@tsed/di";
import {deserialize, JsonDeserializerOptions, serialize} from "@tsed/json-mapper";
import {Logger} from "@tsed/logger";
import {AsyncLocalStorage} from "async_hooks";
import type {Cache, CachingConfig, MultiCache} from "cache-manager";

import {PlatformCacheSettings} from "../interfaces/interfaces.js";
import {PlatformCachedObject} from "../interfaces/PlatformCachedObject.js";
import {getPrefix} from "../utils/getPrefix.js";

const defaultKeyResolver = (args: any[]) => {
  return args.map((arg: any) => (isClass(arg) ? JSON.stringify(serialize(arg)) : arg)).join(":");
};

export type CacheManager = Cache | MultiCache;
export type Ttl = number | ((result: any) => number);

const storage: AsyncLocalStorage<{forceRefresh: boolean}> = new AsyncLocalStorage();

/**
 * @platform
 */
@Module()
export class PlatformCache {
  @Configuration()
  protected settings: Configuration;

  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected logger: Logger;

  #cache: CacheManager | undefined;

  get cache() {
    return this.#cache;
  }

  async $onInit() {
    const settings = this.settings.get<PlatformCacheSettings>("cache");

    if (settings) {
      this.#cache = await this.createCacheManager(settings);

      await this.injector.emit("$onCreateCacheManager", this.#cache);
    }
  }

  getKeysOf(target: Type<any>, propertyKey: string | symbol) {
    const prefix = getPrefix(target, propertyKey);

    return this.keys(`${prefix.join(":")}:*`);
  }

  disabled(): boolean {
    return !this.settings.get<PlatformCacheSettings>("cache");
  }

  defaultKeyResolver() {
    return this.settings.get<(args: any[], ctx?: any) => string>("cache.keyResolver", defaultKeyResolver);
  }

  defaultTtl() {
    return this.settings.get<Ttl>("cache.ttl");
  }

  calculateTTL(result?: any, currentTtl?: Ttl): number {
    const ttl = currentTtl === undefined ? this.defaultTtl() : currentTtl;

    return isFunction(ttl) ? ttl(result) : ttl;
  }

  ttl(key: string) {
    if (this.cache && "store" in this.cache && this.cache.store.ttl) {
      return this.cache.store.ttl(key);
    }

    return Promise.resolve();
  }

  wrap<T>(key: string, fetch: () => Promise<T>, ttl?: number): Promise<T> {
    if (!this.cache) {
      return fetch();
    }

    return this.cache?.wrap<T>(key, fetch, ttl);
  }

  get<T>(key: string, options: JsonDeserializerOptions = {}): Promise<T | undefined> {
    return Promise.resolve(deserialize(this.cache?.get<T>(key), options));
  }

  async set<T>(key: string, value: any, options?: CachingConfig<T>): Promise<T | undefined> {
    await this.cache?.set(key, value, options?.ttl);
    return;
  }

  async getCachedObject(key: string) {
    try {
      return await this.get<PlatformCachedObject>(key);
    } catch (er) {
      this.logger.error({
        event: "CACHE_ERROR",
        method: "getCachedObject",
        error: er
      });
    }
  }

  async setCachedObject(key: string, data: any, opts: {ttl: number} & Record<string, any>) {
    try {
      await this.set<PlatformCachedObject>(
        key,
        {
          ...opts,
          data: JSON.stringify(data)
        },
        {
          ttl: opts.ttl
        }
      );
    } catch (er) {
      this.logger.error({
        event: "CACHE_ERROR",
        method: "setCachedObject",
        error: er
      });
    }
  }

  async del(key: string): Promise<void> {
    await this.cache?.del(key);
  }

  async reset(): Promise<void> {
    // @ts-ignore
    await this.cache?.reset();
  }

  keys(...args: any[]): Promise<string[]> {
    if (this.cache && "store" in this.cache && this.cache.store.keys) {
      return this.cache.store.keys(...args);
    }

    return Promise.resolve([]);
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

  protected async createCacheManager(settings: PlatformCacheSettings) {
    const {caches, store = "memory", ttl, ...props} = settings;

    const {multiCaching, caching} = await import("cache-manager");

    return caches?.length
      ? multiCaching(caches)
      : caching(this.mapStore(store), {
          ...props,
          ttl
        });
  }

  private mapStore(store: "memory" | Function | {create: Function}): any {
    if (!isString(store) && "create" in store) {
      return store.create;
    }

    return store;
  }
}
