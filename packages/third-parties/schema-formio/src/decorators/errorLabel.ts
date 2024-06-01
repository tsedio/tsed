import {Component} from "./component.js";

/**
 * Set the error label when an error occur.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function ErrorLabel(message: string) {
  return Component({
    errorLabel: message
  });
}
