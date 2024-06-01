import {Validate} from "./validate.js";

/**
 * Add the minimum amount of words that can be added to this field.
 * @decorator
 * @formio
 * @property
 * @schema
 * @param value
 */
export function MaxWords(value: number) {
  return Validate("maxWords", value);
}
