/**
 * Checks if a value is a number primitive.
 *
 * @public
 * @since v7.0.0
 */
export function isNumber(target: any): target is number {
  return typeof target === "number";
}

/**
 * Checks if a value is a number primitive, Number object, or the Number constructor.
 *
 * @public
 * @since v7.0.0
 */
export function isNumberOrNumberClass(target: any): target is number {
  return typeof target === "number" || target instanceof Number || target === Number;
}
