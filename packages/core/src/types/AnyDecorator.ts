/**
 * Utility union representing any decorator type supported by TypeScript.
 *
 * Used by Ts.ED to type APIs that accept class, method, property or parameter
 * decorators. This type is handy when a helper must remain generic with regard
 * to the decorated target.
 *
 * @public
 * @since 8.0.0
 */
export type AnyDecorator = any | ClassDecorator | MethodDecorator | PropertyDescriptor | ParameterDecorator;
