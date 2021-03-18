import {isBoolean} from "./isBoolean";
import {isNumber} from "./isNumber";
import {isString} from "./isString";
/**
 * Return true if the given obj is a primitive.
 * @param target
 * @returns {boolean}
 * @ignore
 */
export function isPrimitiveOrPrimitiveClass(target: any): boolean {
  return isString(target) || isNumber(target) || isBoolean(target);
}
/**
 * Return true if the given obj is a primitive.
 * @param target
 * @returns {boolean}
 */
export function isPrimitive(target: any): boolean {
  return isPrimitiveOrPrimitiveClass(target);
}
