/**
 * Checks whether an object has a toJSON method.
 *
 * @public
 * @since v7.0.0
 */
export function hasJsonMethod(obj: any) {
  return obj && typeof obj.toJSON === "function";
}
