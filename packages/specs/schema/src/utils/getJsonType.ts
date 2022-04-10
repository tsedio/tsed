import {isArray, isBuffer, isDate, isPrimitiveOrPrimitiveClass, primitiveOf} from "@tsed/core";

/**
 * @ignore
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
      if (value === "file") {
        return "file";
      }

      return "generic";
    }

    return primitiveOf(value);
  }

  if (value === Array) {
    return "array";
  }

  if (isArray(value)) {
    return value.map(getJsonType) as any;
  }

  if (value === Set) {
    return "array";
  }

  if (isDate(value) || isBuffer(value)) {
    return "string";
  }

  return "object";
}
