import {Component} from "./component";

/**
 * Configure the property as Textarea component.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Textarea(props: Record<string, any> = {}): PropertyDecorator {
  return Component({
    autoExpand: false,
    ...props,
    type: "textarea"
  });
}
