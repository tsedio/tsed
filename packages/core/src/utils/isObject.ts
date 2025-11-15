/**
 * Checks if a value is an object type.
 *
 * @public
 * @since v7.0.0
 */
export function isObject(target: any): target is object {
  return typeof target === "object";
}
