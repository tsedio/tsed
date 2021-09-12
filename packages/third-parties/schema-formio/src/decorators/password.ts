import {Component} from "./component";
/**
 * Configure the property as Password component.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Password(props: Record<string, any> = {}): PropertyDecorator {
  return Component({
    ...props,
    type: "password",
    protected: true
  });
}
