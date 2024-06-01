import {Component} from "./component.js";
/**
 * Configure the property as Currency component.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function Currency(props: Record<string, any> = {}): PropertyDecorator {
  return Component({
    currency: "USD",
    inputFormat: "plain",
    mask: false,
    spellcheck: true,
    delimiter: true,
    ...props,
    type: "currency"
  });
}
