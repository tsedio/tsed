import {isBoolean, isBooleanOrBooleanClass} from "./isBoolean";
import {isNumber, isNumberOrNumberClass} from "./isNumber";
import {isString, isStringOrStringClass} from "./isString";

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
