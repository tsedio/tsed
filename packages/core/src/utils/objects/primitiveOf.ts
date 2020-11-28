import {isBoolean} from "./isBoolean";
import {isNumber} from "./isNumber";
import {isString} from "./isString";

export function primitiveOf(target: any): "string" | "number" | "boolean" | "any" {
  if (isString(target)) {
    return "string";
  }
  if (isNumber(target)) {
    return "number";
  }
  if (isBoolean(target)) {
    return "boolean";
  }

  return "any";
}
