import {Type, nameOf} from "@tsed/core";
import type {PlatformCacheOptions} from "../interfaces/PlatformCacheOptions.js";
import {getInterceptorOptions} from "@tsed/di";

export function getPrefix(target: Type<any>, propertyKey: string | symbol) {
  const {prefix} = getInterceptorOptions<PlatformCacheOptions>(target, propertyKey);
  if (prefix) {
    return [prefix];
  }

  return [nameOf(target), propertyKey];
}
