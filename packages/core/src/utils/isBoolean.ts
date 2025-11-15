/**
 * Checks if a value is a boolean primitive.
 *
 * @public
 * @since v7.0.0
 */
export function isBoolean(target: any): target is boolean {
  return typeof target === "boolean" || target instanceof Boolean || target === Boolean;
}

/**
 * Checks if a value is a boolean primitive, Boolean object, or the Boolean constructor.
 *
 * @public
 * @since v7.0.0
 */
export function isBooleanOrBooleanClass(target: any): target is boolean {
  return typeof target === "boolean" || target instanceof Boolean || target === Boolean;
}
