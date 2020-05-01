import {isArrayOrArrayClass, isDate, isPrimitiveOrPrimitiveClass, primitiveOf} from "@tsed/core";
import {JSONSchema6TypeName} from "json-schema";

/**
 *
 * @type {string[]}
 */
export const JSON_TYPES = ["string", "number", "integer", "boolean", "object", "array", "null", "any"];

export function getJsonType(value: any): JSONSchema6TypeName | JSONSchema6TypeName[] {
  if (isPrimitiveOrPrimitiveClass(value)) {
    if (JSON_TYPES.indexOf(value as string) > -1) {
      return value;
    }

    return primitiveOf(value);
  }

  if (isArrayOrArrayClass(value)) {
    if (value !== Array) {
      return value;
    }

    return "array";
  }

  if (isDate(value)) {
    return "string";
  }

  return "object";
}
