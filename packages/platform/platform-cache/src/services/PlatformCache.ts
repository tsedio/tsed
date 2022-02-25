import {isClass, isFunction} from "@tsed/core";
import {Configuration, Inject, InjectorService, Module} from "@tsed/di";
import {deserialize, JsonDeserializerOptions, serialize} from "@tsed/json-mapper";
import type {Cache, CachingConfig, MultiCache, TtlFunction} from "cache-manager";
import {PlatformCachedObject} from "../interfaces/PlatformCachedObject";
import {PlatformCacheSettings} from "../interfaces/interfaces";
import {Logger} from "@tsed/logger";

const defaultKeyResolver = (args: any[]) => {
  return args.map((arg: any) => (isClass(arg) ? JSON.stringify(serialize(arg)) : arg)).join(":");
};

export type CacheManager = Cache | MultiCache;

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

  disabled(): boolean {
    return !this.settings.get<PlatformCacheSettings>("cache");
  }

  defaultKeyResolver() {
    return this.settings.get<(args: any[], ctx?: any) => string>("cache.keyResolver", defaultKeyResolver);
  }

  defaultTtl() {
    return this.settings.get<number | TtlFunction>("cache.ttl");
  }

  calculateTTL(result?: any, currentTtl?: number | TtlFunction) {
    const ttl = currentTtl === undefined ? this.defaultTtl() : currentTtl;

    return isFunction(ttl) ? ttl(result) : ttl;
  }

  async ttl(key: string) {
    if (this.cache && "store" in this.cache && this.cache.store.ttl) {
      return this.cache.store.ttl(key);
    }
  }

  wrap<T>(key: string, fetch: () => Promise<T>, options?: CachingConfig): Promise<T> {
    if (!this.cache) {
      return fetch();
    }

    return this.cache?.wrap<T>(key, fetch, options as any);
  }

  async get<T>(key: string, options: JsonDeserializerOptions = {}): Promise<T | undefined> {
    return deserialize(this.cache?.get<T>(key), options);
  }

  async set<T>(key: string, value: any, options?: CachingConfig): Promise<T | undefined> {
    return this.cache?.set<T>(key, value, options);
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

  async keys(...args: any[]): Promise<string[]> {
    if (this.cache && "store" in this.cache && this.cache.store.keys) {
      return this.cache.store.keys(...args);
    }

    // istanbul ignore next
    return [];
  }

  async getMatchingKeys(patterns: string): Promise<string[]> {
    const [keys, {default: micromatch}] = await Promise.all([this.keys(), import("micromatch")]);

    return micromatch(keys, patterns);
  }

  async deleteMatchingKeys(patterns: string): Promise<string[]> {
    const keys = await this.getMatchingKeys(patterns);

    await Promise.all(keys.map((key: string) => this.del(key)));

    return keys;
  }

  protected async createCacheManager(settings: PlatformCacheSettings) {
    const {caches, store = "memory", ttl, ...props} = settings;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {default: cacheManager} = await import("cache-manager");

    return caches?.length
      ? cacheManager.multiCaching(caches, {...props})
      : cacheManager.caching({
          ...props,
          ttl,
          store: isFunction(store) ? await store() : store
        });
  }
}
