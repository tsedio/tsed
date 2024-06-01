import {Component} from "./component.js";

/**
 * Change the visibility of the current property on a table.
 * @param bool
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function TableView(bool: boolean): PropertyDecorator {
  return Component({
    tableView: bool
  });
}
