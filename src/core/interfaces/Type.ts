/**
 * @module core
 */ /** */

/**
 * @whatItDoes Represents a type that a Component or other object is instances of.
 *
 * @description
 *
 * An example of a `Type` is `MyCustomComponent` filters, which in JavaScript is be represented by
 * the `MyCustomComponent` constructor function.
 *
 * @stable
 */
export const Type = Function;
/**
 *
 */
export interface Type<T> extends Function {
    new (...args: any[]): T;
}