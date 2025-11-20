/**
 * Enumeration defining types of injectable properties and decorators.
 *
 * Used internally to track and classify different kinds of injected dependencies
 * and decorated members within a class.
 *
 * ### Types
 *
 * - `METHOD`: Injectable method parameter
 * - `PROPERTY`: Injectable class property
 * - `CONSTANT`: Injected constant value
 * - `VALUE`: Injected configured value
 * - `INTERCEPTOR`: Interceptor applied to a method
 *
 * @public
 */
export enum InjectablePropertyType {
  METHOD = "method",
  PROPERTY = "property",
  CONSTANT = "constant",
  VALUE = "value",
  INTERCEPTOR = "interceptor"
}
