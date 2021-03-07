import {Cache, CacheOptions, CachingConfig, Store} from "cache-manager";
import {PlatformContext} from "../../platform/domain/PlatformContext";

export interface CacheSettings extends CacheOptions, CachingConfig {
  caches?: Cache[];
  store?:
    | "memory"
    | "none"
    | Store
    | {
        create(...args: any[]): Store;
      };
  max?: number;
  keyResolver?: (args: any[], ctx: PlatformContext) => string;

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
      cache?: CacheSettings | false;
    }
  }
}
