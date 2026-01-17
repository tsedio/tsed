import {isFunction} from "@tsed/core";

/**
 * Return enumerable entries of an object while skipping function values (methods/getters).
 */
export function getObjectProperties(obj: any): [string, any][] {
  return Object.entries(obj).filter(([, value]) => !isFunction(value));
}
