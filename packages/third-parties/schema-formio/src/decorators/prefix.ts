import {Component} from "./component.js";

/**
 * Add prefix word on the decorated field.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Prefix(prefix: string) {
  return Component({
    prefix
  });
}
