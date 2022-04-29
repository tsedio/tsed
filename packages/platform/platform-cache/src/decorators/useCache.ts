import {Intercept} from "@tsed/di";
import {PlatformCacheInterceptor} from "../interceptors/PlatformCacheInterceptor";
import {PlatformCacheOptions} from "../interfaces/PlatformCacheOptions";

export function UseCache(options: PlatformCacheOptions = {}) {
  return Intercept(PlatformCacheInterceptor, options);
}
