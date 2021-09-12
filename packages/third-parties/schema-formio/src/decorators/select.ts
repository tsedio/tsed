import {Component} from "./component";

/**
 * Configure the property as Select component.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Select(props: Record<string, any> = {}): PropertyDecorator {
  return Component({
    selectThreshold: 0.3,
    input: true,
    widget: "choicesjs",
    ...props,
    type: "select"
  });
}
