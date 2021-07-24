import {Component} from "./component";

/**
 * Set hidden field.
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
