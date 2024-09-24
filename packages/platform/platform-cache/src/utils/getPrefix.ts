import {nameOf, Type} from "@tsed/core";
import {getInterceptorOptions} from "@tsed/di";

import type {PlatformCacheOptions} from "../interfaces/PlatformCacheOptions.js";

export function getPrefix(target: Type<any>, propertyKey: string | symbol) {
  const {prefix} = getInterceptorOptions<PlatformCacheOptions>(target, propertyKey);
  if (prefix) {
    return [prefix];
  }

  return [nameOf(target), propertyKey];
}
