import {Component} from "./component";

/**
 * Force the output of this field to be sanitized in a specific format.
 * @decorator
 * @formio
 * @property
 * @schema
 * @param textCase
 */
export function TextCase(textCase: "uppercase" | "lowercase") {
  return Component({
    case: textCase
  });
}
