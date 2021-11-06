import {Component} from "./component";

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
