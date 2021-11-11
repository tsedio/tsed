import {isFunction} from "./isFunction";

export function isArrowFn(target: any): target is Function {
  return target && isFunction(target) && !target.prototype;
}
