import {isNil} from "./isNil";

/**
 * Return true if the value is an empty string, null or undefined.
 * @param value
 * @returns {boolean}
 */
export function isEmpty(value: any): boolean {
  return value === "" || isNil(value);
}
