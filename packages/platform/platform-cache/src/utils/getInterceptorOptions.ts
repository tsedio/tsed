import {Store, Type} from "@tsed/core";
import {INJECTABLE_PROP} from "@tsed/di";
import {PlatformCacheOptions} from "../interfaces/PlatformCacheOptions";

export function getInterceptorOptions(target: Type<any>, propertyKey: string | symbol): PlatformCacheOptions {
  return Store.from(target).get(INJECTABLE_PROP)?.[propertyKey]?.options;
}
