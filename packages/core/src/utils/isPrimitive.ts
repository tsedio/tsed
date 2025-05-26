import {isBoolean, isBooleanOrBooleanClass} from "./isBoolean.js";
import {isNumber, isNumberOrNumberClass} from "./isNumber.js";
import {isString, isStringOrStringClass} from "./isString.js";

/**
 * Return true if the given obj is a primitive.
 * @param target
 * @returns {boolean}
 * @ignore
 */
export function isPrimitiveOrPrimitiveClass(target: any): boolean {
  return isStringOrStringClass(target) || isNumberOrNumberClass(target) || isBooleanOrBooleanClass(target);
}

/**
 * Return true if the given obj is a primitive.
 * @param target
 * @returns {boolean}
 */
export function isPrimitive(target: any): boolean {
  return isString(target) || isNumber(target) || isBoolean(target);
}

export function isPrimitiveClass(target: any) {
  return [String, Number, Boolean].includes(target);
}
