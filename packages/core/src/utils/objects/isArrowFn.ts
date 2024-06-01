import {isFunction} from "./isFunction.js";

export function isArrowFn(target: any): target is Function {
  return target && isFunction(target) && !target.prototype;
}
