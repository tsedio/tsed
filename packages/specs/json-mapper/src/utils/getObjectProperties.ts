import {isFunction} from "@tsed/core";

export function getObjectProperties(obj: any): [string, any][] {
  return Object.entries(obj).filter(([, value]) => !isFunction(value));
}
