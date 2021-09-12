import {classOf} from "@tsed/core";

/**
 * @ignore
 */
export function defineStaticGetter(target: any, propertyKey: string, fn: any) {
  return Object.defineProperty(classOf(target), propertyKey, {
    get: fn
  });
}
