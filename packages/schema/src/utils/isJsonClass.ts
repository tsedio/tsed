import {isClass} from "@tsed/core";

export function isJsonClass(type: any) {
  return isClass(type) && ![Map, Array, Set, Object, Date, Boolean, Number, String].includes(this._target as any);
}
