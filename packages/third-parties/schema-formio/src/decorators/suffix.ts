import {Component} from "./component.js";

/**
 * Add suffix word on the decorated field.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Suffix(suffix: string) {
  return Component({
    suffix
  });
}
