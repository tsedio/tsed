import {Component} from "./component";

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
