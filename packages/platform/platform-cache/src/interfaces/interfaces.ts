import type {BaseContext} from "@tsed/di";
import type {Cache, CachingConfig, Store} from "cache-manager";
import type {FactoryStore} from "cache-manager/dist/caching.js";

import type {CacheManager} from "../services/PlatformCache.js";

export type PlatformCacheSettings<Config extends Record<string, any> = any, S extends Store = any> = CachingConfig<Config> & {
  caches?: Cache[];
  store?: "memory" | Store | FactoryStore<S, Config>;
  max?: number;
  keyResolver?: (args: any[], ctx: BaseContext) => string;
  prefix?: string;
  /**
   * List of headers to ignore when caching the response. Default: ["content-length", "x-request-id", "cache-control", "vary", "content-encoding"]
   */
  ignoreHeaders?: string[];
  /**
   * You may pass in any other arguments these will be passed on to the `create` method of your store,
   * otherwise they will be ignored.
   */
  [key: string]: any;
};

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
