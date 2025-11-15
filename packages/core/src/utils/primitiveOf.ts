import {isBooleanOrBooleanClass} from "./isBoolean.js";
import {isNumberOrNumberClass} from "./isNumber.js";
import {isStringOrStringClass} from "./isString.js";

/**
 * Determines the primitive type name for a given target value or class.
 *
 * @public
 * @since v7.0.0
 */
export function primitiveOf(target: any): "string" | "number" | "boolean" | "any" {
  if (isStringOrStringClass(target)) {
    return "string";
  }

  if (isNumberOrNumberClass(target)) {
    return "number";
  }

  if (isBooleanOrBooleanClass(target)) {
    return "boolean";
  }

  return "any";
}
