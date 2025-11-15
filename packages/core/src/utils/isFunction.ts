/**
 * Checks if a value is a function.
 *
 * @public
 * @since v7.0.0
 */
export function isFunction(target: any): target is Function {
  return typeof target === "function";
}
