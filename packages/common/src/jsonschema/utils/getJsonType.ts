import {isArrayOrArrayClass, isDate, isPrimitiveOrPrimitiveClass, primitiveOf} from "@tsed/core";
import {JSONSchema6TypeName} from "json-schema";

/**
 *
 * @type {string[]}
 */
export const JSON_TYPES = ["string", "number", "integer", "boolean", "object", "array", "null", "any"];

/**
 * Get json type of the give value.
 *
 * ::: warning
 * Will be remove in v6 in favor of getJsonSchema from @tsed/schema.
 * :::
 */
export function getJsonType(value: any): JSONSchema6TypeName | JSONSchema6TypeName[] {
  if (value === null) {
    return "null";
  }
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
