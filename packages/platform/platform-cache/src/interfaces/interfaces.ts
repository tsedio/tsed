import type {BaseContext} from "@tsed/di";
import type {Cache, CacheOptions, CachingConfig, Store} from "cache-manager";

export interface PlatformCacheSettings extends CacheOptions, CachingConfig {
  caches?: Cache[];
  store?:
    | "memory"
    | "none"
    | Store
    | {
        create(...args: any[]): Store;
      }
    | (() => any);
  max?: number;
  keyResolver?: (args: any[], ctx: BaseContext) => string;

  /**
   * You may pass in any other arguments these will be passed on to the `create` method of your store,
   * otherwise they will be ignored.
   */
  [key: string]: any;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace TsED {
    interface Configuration {
      cache?: PlatformCacheSettings | false;
    }
  }
}
