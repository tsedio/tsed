import {Component} from "./component.js";

/**
 * Set hidden field.
 *
 * A hidden field is still a part of the form, but is hidden from view.
 *
 * @param bool
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Hidden(bool: boolean = true): PropertyDecorator {
  return Component({
    hidden: bool
  });
}
