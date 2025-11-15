import {isBoolean, isBooleanOrBooleanClass} from "./isBoolean.js";
import {isNumber, isNumberOrNumberClass} from "./isNumber.js";
import {isString, isStringOrStringClass} from "./isString.js";

/**
 * Checks if a value is a primitive or primitive class constructor (String, Number, Boolean).
 *
 * @public
 * @since v7.0.0
 */
export function isPrimitiveOrPrimitiveClass(target: any): boolean {
  return isStringOrStringClass(target) || isNumberOrNumberClass(target) || isBooleanOrBooleanClass(target);
}

/**
 * Checks if a value is a primitive type (string, number, or boolean).
 *
 * @public
 * @since v7.0.0
 */
export function isPrimitive(target: any): boolean {
  return isString(target) || isNumber(target) || isBoolean(target);
}

/**
 * Checks if a value is a primitive class constructor (String, Number, or Boolean).
 *
 * @public
 * @since v7.0.0
 */
export function isPrimitiveClass(target: any) {
  return [String, Number, Boolean].includes(target);
}
