import {Component} from "./component.js";

/**
 * Adds a conditional display rule on the input form.
 * @decorator
 * @formio
 * @property
 * @schema
 * @param conditional
 */
export function Conditional(conditional: {show: boolean; when: string; eq: any}) {
  return Component({
    conditional
  });
}

/**
 * Adds a conditional display rule on the input form.
 * @decorator
 * @formio
 * @property
 * @schema
 * @param property
 * @param eq
 */
export function ShowWhen(property: string, eq: any) {
  return Conditional({
    show: true,
    when: property,
    eq
  });
}

/**
 * Adds a conditional display rule on the input form.
 * @decorator
 * @formio
 * @property
 * @schema
 * @param property
 * @param eq
 */
export function HideWhen(property: string, eq: any) {
  return Conditional({
    show: false,
    when: property,
    eq
  });
}
