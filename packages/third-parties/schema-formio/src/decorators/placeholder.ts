import {Component} from "./component.js";

/**
 * The placeholder text that will appear when this field is empty.
 * @decorator
 * @formio
 * @property
 * @schema
 * @param placeholder
 */
export function Placeholder(placeholder: string) {
  return Component({
    placeholder
  });
}
