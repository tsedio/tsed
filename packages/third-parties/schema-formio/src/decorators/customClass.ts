import {Component} from "./component.js";

/**
 * Add a custom css class.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function CustomClass(customClass: string) {
  return Component({
    customClass
  });
}
