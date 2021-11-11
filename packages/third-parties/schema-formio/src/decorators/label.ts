import {Component} from "./component";

/**
 * Change the label field
 * @decorator
 * @formio
 * @property
 * @schema
 * @param label
 */
export function Label(label: string) {
  return Component({
    label
  });
}
