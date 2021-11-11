import {Component} from "./component";

export interface PasswordOpts extends Record<string, any> {
  showCharCount?: boolean;
  showWordCount?: boolean;
}
/**
 * Configure the property as Password component.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Password(props: PasswordOpts = {}): PropertyDecorator {
  return Component({
    ...props,
    type: "password",
    protected: true
  });
}
