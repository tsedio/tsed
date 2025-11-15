/**
 * Raw parameters passed by the TypeScript runtime to any decorator
 * (class, property, method or parameter).
 *
 * The tuple contains:
 * - the target (class `prototype` for instance members or the constructor for static members),
 * - the key (`string | symbol`) of the decorated member,
 * - the parameter index (number) or the `PropertyDescriptor` depending on the decorator type.
 *
 * @example
 * ```ts
 * function MyDecorator(...args: DecoratorParameters) {}
 * ```
 * @public
 */
export type DecoratorParameters = [any, string | symbol, number | PropertyDescriptor];

/**
 * Specialized variant for method decorators where the third element
 * is always a `PropertyDescriptor`.
 *
 * @public
 */
export type DecoratorMethodParameters = [any, string | symbol, PropertyDescriptor];

export type StaticMethodDecorator = <TFunction extends Function, T>(
  target: TFunction,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;
