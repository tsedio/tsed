import {nameOf, Type} from "@tsed/core";
import {getInterceptorOptions} from "./getInterceptorOptions";

export function getPrefix(target: Type<any>, propertyKey: string | symbol) {
  const {prefix} = getInterceptorOptions(target, propertyKey);
  if (prefix) {
    return [prefix];
  }

  return [nameOf(target), propertyKey];
}
