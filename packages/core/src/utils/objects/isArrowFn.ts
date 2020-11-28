import {isFunction} from "./isFunction";

export function isArrowFn(target: any) {
  return target && isFunction(target) && !target.prototype;
}
