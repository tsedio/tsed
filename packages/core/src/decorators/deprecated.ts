import type {Type} from "../domain/Type.js";

function deprecate(fn: any, msg: string) {
  if (typeof process !== "undefined" && (process as any).noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === "undefined") {
    return function (...args: any[]) {
      return deprecate(fn, msg).apply(this, args);
    };
  }

  let warned = false;

  function deprecated(...args: any[]) {
    if (!warned) {
      if ((process as any).throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, args);
  }

  return deprecated;
}

/**
 * The `@Deprecated()` decorators wraps the given method in such a way that it is marked as deprecated.
 *
 * ```typescript
 * provide Foo {
 *
 * @Deprecated("Foo.method: Use Foo.method2 instead")
 * public method() {
 *
 * }
 * ```
 *
 * When called, @Deprecated() will return a function that will emit a `DeprecationWarning` using the `process.on('warning')` event.
 * By default, this warning will be emitted and printed to `stderr` exactly once, the first time it is called. After the warning is emitted, the wrapped method is called.
 *
 * If either the `--no-deprecation` or `--no-warnings` command line flags are used, or if the `process.noDeprecation`
 * property is set to `true` prior to the first deprecation warning, the `@Deprecated()` decorators does nothing.
 *
 * If the `--trace-deprecation` or `--trace-warnings` command line flags are set, or the `process.traceDeprecation`
 * property is set to `true`, a warning and a stack trace are printed to stderr the first time the deprecated function is called.
 *
 * If the `--throw-deprecation` command line flag is set, or the `process.throwDeprecation` property is set to `true`,
 * then an exception will be thrown when the deprecated function is called.
 *
 * The `--throw-deprecation` command line flag and `process.throwDeprecation` property take precedence over `--trace-deprecation`
 * and `process.traceDeprecation`.
 *
 * @param message
 * @returns {Function}
 * @decorator
 */
export function Deprecated(message: string): Function {
  return (target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value;

    descriptor.value = deprecate(originalMethod, message);

    return descriptor;
  };
}
