import {Component} from "./component.js";

/**
 * Change the multiple value on the decorated property.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Multiple(multiple = false): PropertyDecorator {
  return Component({
    multiple
  });
}
