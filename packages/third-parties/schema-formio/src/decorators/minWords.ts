import {Validate} from "./validate";

/**
 * Add the maximum amount of words that can be added to this field.
 * @decorator
 * @formio
 * @property
 * @schema
 * @param value
 */
export function MinWords(value: number) {
  return Validate("minWords", value);
}
