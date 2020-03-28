import {isArrayOrArrayClass, isDate, isPrimitiveOrPrimitiveClass, primitiveOf} from "@tsed/core";

/**
 *
 * @type {string[]}
 */
export const JSON_TYPES = ["string", "number", "integer", "boolean", "object", "array", "null", "any"];

export function getJsonType(value: any): string {
  if (value === null) {
    return "null";
  }

  if (isPrimitiveOrPrimitiveClass(value)) {
    if (JSON_TYPES.indexOf(value as string) > -1) {
      return value;
    }

    if (typeof value === "string") {
      return "generic";
    }

    return primitiveOf(value);
  }

  if (isArrayOrArrayClass(value)) {
    if (value !== Array) {
      return value.map(getJsonType);
    }

    return "array";
  }

  if (value === Set) {
    return "array";
  }

  if (isDate(value)) {
    return "string";
  }

  return "object";
}
