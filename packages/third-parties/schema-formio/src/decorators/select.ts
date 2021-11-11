import {Component} from "./component";

export interface SelectOpts extends Record<string, any> {
  idPath?: string;
  valueProperty?: string;
  template?: string;
  multiple?: boolean;
}

/**
 * Configure the property as Select component.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Select(props: SelectOpts = {}): PropertyDecorator {
  return Component({
    selectThreshold: 0.3,
    input: true,
    widget: "choicesjs",
    ...props,
    type: "select"
  });
}
