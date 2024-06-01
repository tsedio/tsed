import {Component} from "./component.js";

/**
 * Add validation rules.
 * @decorator
 * @formio
 * @property
 * @schema
 * @param key
 * @param value
 */
export function Validate(key: string, value: any) {
  return Component({
    validate: {
      [key]: value
    }
  });
}
