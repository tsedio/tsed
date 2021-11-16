import {Component} from "./component";

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
