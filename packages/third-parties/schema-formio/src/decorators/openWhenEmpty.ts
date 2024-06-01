import {Component} from "./component.js";

/**
 * Open automatically the editgrid when the list is empty.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function OpenWhenEmpty(openWhenEmpty = true): PropertyDecorator {
  return Component({
    openWhenEmpty
  });
}
