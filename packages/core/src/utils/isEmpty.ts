import {isNil} from "./isNil.js";

/**
 * Checks if a value is an empty string, null, or undefined.
 *
 * @public
 * @since v7.0.0
 */
export function isEmpty(value: any): boolean {
  return value === "" || isNil(value);
}
