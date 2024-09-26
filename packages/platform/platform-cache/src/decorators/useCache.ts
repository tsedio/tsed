import {Intercept} from "@tsed/di";

import {PlatformCacheInterceptor} from "../interceptors/PlatformCacheInterceptor.js";
import type {PlatformCacheOptions} from "../interfaces/PlatformCacheOptions.js";

export function UseCache(options: PlatformCacheOptions = {}) {
  return Intercept(PlatformCacheInterceptor, options);
}
