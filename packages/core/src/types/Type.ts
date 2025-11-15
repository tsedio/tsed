/**
 * Represents a class constructor `new (...args) => T`.
 *
 * In Ts.ED, `Type<T>` is used to type class references (controllers, services, models, etc.) where a constructor is expected.
 *
 * @typeParam T Type of the instance created by the constructor.
 * @public
 */
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

/**
 * Alias of the JavaScript base constructor, used to preserve
 * compatibility with certain inference contexts.
 *
 * @deprecated Avoid using this constant directly; prefer the `Type<T>` type.
 */
export const Type = Function;

/**
 * Describes an abstract type (abstract class), useful for declaring dependencies that should not be instantiated directly.
 */
export interface AbstractType<T> extends Function {
  prototype: T;
}
