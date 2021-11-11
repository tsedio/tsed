import {Component} from "./component";

export interface TextareaOpts extends Record<string, any> {
  showCharCount?: boolean;
  showWordCount?: boolean;
}

/**
 * Configure the property as Textarea component.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Textarea(props: TextareaOpts = {}): PropertyDecorator {
  return Component({
    autoExpand: false,
    ...props,
    type: "textarea"
  });
}
