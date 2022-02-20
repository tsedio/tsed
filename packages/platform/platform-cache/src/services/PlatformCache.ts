import {isClass, isFunction} from "@tsed/core";
import {Configuration, Module} from "@tsed/di";
import {deserialize, JsonDeserializerOptions, serialize} from "@tsed/json-mapper";
import type {Cache, CachingConfig, MultiCache, TtlFunction} from "cache-manager";
import {PlatformCacheSettings} from "../interfaces/interfaces";

const defaultKeyResolver = (args: any[]) => {
  return args.map((arg: any) => (isClass(arg) ? JSON.stringify(serialize(arg)) : arg)).join(":");
};

export type CacheManager = (Cache | MultiCache) & {
  keys?(): Promise<string[]>;
};

/**
 * @platform
 */
@Module()
export class PlatformCache {
  @Configuration()
  settings: Configuration;

  cache: CacheManager | undefined;

  disabled(): boolean {
    return !this.settings.get<PlatformCacheSettings>("cache");
  }

  async $onInit() {
    const settings = this.settings.get<PlatformCacheSettings>("cache");

    if (settings) {
      this.cache = await this.createCacheManager(settings);
    }
  }

  defaultKeyResolver() {
    return this.settings.get<(args: any[], ctx?: any) => string>("cache.keyResolver", defaultKeyResolver);
  }

  defaultTtl() {
    return this.settings.get<number | TtlFunction>("cache.ttl");
  }

  ttl(result?: any, currentTtl?: number | TtlFunction) {
    const ttl = currentTtl === undefined ? this.defaultTtl() : currentTtl;

    return isFunction(ttl) ? ttl(result) : ttl;
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

  async del(key: string): Promise<void> {
    await this.cache?.del(key);
  }

  async reset(): Promise<void> {
    // @ts-ignore
    await this.cache?.reset();
  }

  async keys(): Promise<string[]> {
    if (this.cache?.keys) {
      return this.cache.keys();
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
