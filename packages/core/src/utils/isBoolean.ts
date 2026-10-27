/**
 * Checks if a value is a boolean primitive.
 *
 * The `Boolean` constructor and boxed `new Boolean()` values are not accepted, like
 * {@link isString} and {@link isNumber}. Use {@link isBooleanOrBooleanClass} to accept them.
 *
 * @public
 * @since v7.0.0
 */
export function isBoolean(target: any): target is boolean {
  return typeof target === "boolean";
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
