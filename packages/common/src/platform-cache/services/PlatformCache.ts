import {isClass, isFunction} from "@tsed/core";
import {Configuration, Injectable} from "@tsed/di";
import {deserialize, JsonDeserializerOptions, serialize} from "@tsed/json-mapper";
import cacheManager, {Cache, CachingConfig, MultiCache, TtlFunction} from "cache-manager";
import {PlatformContext} from "../../platform/domain/PlatformContext";
import {CacheSettings} from "../interfaces";

const defaultKeyResolver = (args: any[]) => {
  return args.map((arg: any) => (isClass(arg) ? JSON.stringify(serialize(arg)) : arg)).join(":");
};

/**
 * @platform
 */
@Injectable()
export class PlatformCache {
  @Configuration()
  settings: Configuration;

  cache: Cache | MultiCache | undefined;

  disabled(): boolean {
    return !this.settings.get<CacheSettings>("cache");
  }

  $onInit() {
    const settings = this.settings.get<CacheSettings>("cache");

    if (settings) {
      const {caches, store = "memory", ttl, ...props} = settings;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.cache = caches?.length
        ? cacheManager.multiCaching(caches, {...props})
        : cacheManager.caching({
            ...props,
            ttl,
            store
          });
    }
  }

  defaultKeyResolver() {
    return this.settings.get<(args: any[], ctx?: PlatformContext) => string>("cache.keyResolver", defaultKeyResolver);
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
    return deserialize(this.cache?.get<T>(key));
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
}
