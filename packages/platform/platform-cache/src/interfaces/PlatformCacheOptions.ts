import {MetadataTypes} from "@tsed/core";
import {BaseContext} from "@tsed/di";

import type {Ttl} from "../services/PlatformCache.js";

export interface PlatformCacheOptions extends MetadataTypes {
  /**
   * key expiration ttl in seconds.
   */
  ttl?: Ttl;
  /**
   * By default, the key is generated from the method name and the arguments passed to the method.
   */
  prefix?: string;
  /**
   * Algorithm used to generate the key. By default, the key is generated from the method name and the arguments passed to the method.
   */
  key?: string | ((args: any[], ctx?: BaseContext) => string);
  /**
   * threshold to refresh the cache.
   */
  refreshThreshold?: number;
  /**
   * The function determine if the result must be cached or not.
   */
  canCache?: ((item: any) => boolean) | "no-nullish";
  /**
   * Configure the bypass cache strategy.
   * - `false` (default for services) never bypasses the cache.
   * - `"no-cache"` (default for HTTP endpoints) bypasses when the `Cache-Control: no-cache` header is present.
   * - Provide a function to decide dynamically based on the current call arguments/context.
   */
  byPass?: false | "no-cache" | ((args: any[], $ctx?: BaseContext) => boolean);
}
