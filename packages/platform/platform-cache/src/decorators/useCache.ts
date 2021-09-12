import {useDecorators} from "@tsed/core";
import {Intercept} from "@tsed/di";
import {PlatformCacheInterceptor} from "../interceptors/PlatformCacheInterceptor";
import {PlatformCacheOptions} from "../interfaces/PlatformCacheOptions";

export function UseCache(options: PlatformCacheOptions = {}) {
  return useDecorators(Intercept(PlatformCacheInterceptor, options));
}
