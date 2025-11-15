/**
 * Checks if a value is a string primitive.
 *
 * @public
 * @since v7.0.0
 */
export function isString(target: any): target is string {
  return typeof target === "string";
}

/**
 * Checks if a value is a string primitive, String object, or the String constructor.
 *
 * @public
 * @since v7.0.0
 */
export function isStringOrStringClass(target: any): target is string {
  return typeof target === "string" || target instanceof String || target === String;
}
