import {Component} from "./component";

/**
 * Adds a tooltip to the side of this field.
 * @decorator
 * @formio
 * @property
 * @schema
 * @param tooltip
 */
export function Tooltip(tooltip: string) {
  return Component({
    tooltip
  });
}
