/**
 * An example of a `Type` is `MyCustomComponent` filters, which in JavaScript is represented by
 * the `MyCustomComponent` constructor function.
 */
// tslint:disable-next-line: variable-name
/**
 *
 */
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export const Type = Function;

// @ts-ignore
global.Type = Type;

export interface AbstractType<T> extends Function {
  prototype: T;
}
