import {Validate} from "./validate";

/**
 * Add error message when an error occur.
 * @decorator
 * @formio
 * @property
 * @schema
 * @param message
 */
export function ErrorMessage(message: string) {
  return Validate("customMessage", message);
}
