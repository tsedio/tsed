/**
 * An example of a `Type` is `MyCustomComponent` filters, which in JavaScript is be represented by
 * the `MyCustomComponent` constructor function.
 */
// tslint:disable-next-line: variable-name
export const Type = Function;

/**
 *
 */
export interface Type<T> extends Function {
  new (...args: any[]): T;
}
