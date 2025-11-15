import {isFunction} from "./isFunction.js";

/**
 * Checks if a value is an arrow function by verifying it has no prototype property.
 *
 * @public
 * @since v7.0.0
 */
export function isArrowFn(target: any): target is Function {
  return target && isFunction(target) && !target.prototype;
}
