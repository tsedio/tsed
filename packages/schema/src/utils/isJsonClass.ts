import {isClass} from "@tsed/core";

/**
 * @ignore
 */
export function isJsonClass(type: any) {
  return isClass(type) && ![Map, Array, Set, Object, Date, Boolean, Number, String].includes(this._target as any);
}
