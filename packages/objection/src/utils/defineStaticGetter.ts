import {classOf} from "@tsed/core";

export function defineStaticGetter(target: any, propertyKey: string, fn: any) {
  return Object.defineProperty(classOf(target), propertyKey, {
    get: fn
  });
}
