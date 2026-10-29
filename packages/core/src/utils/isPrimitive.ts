/**
 * Checks if a value is a primitive or primitive class constructor (String, Number, Boolean).
 *
 * @public
 * @since v7.0.0
 */
export function isPrimitiveOrPrimitiveClass(target: any): boolean {
  const type = typeof target;

  // inlined isStringOrStringClass() || isNumberOrNumberClass() || isBooleanOrBooleanClass(): called per value
  if (type === "string" || type === "number" || type === "boolean") {
    return true;
  }

  return (
    target instanceof String ||
    target === String ||
    target instanceof Number ||
    target === Number ||
    target instanceof Boolean ||
    target === Boolean
  );
}

/**
 * Checks if a value is a primitive type (string, number, or boolean).
 *
 * @public
 * @since v7.0.0
 */
export function isPrimitive(target: any): boolean {
  const type = typeof target;

  // inlined isString() || isNumber() || isBoolean(), which also accepts `Boolean` and `new Boolean()`
  return type === "string" || type === "number" || type === "boolean" || target instanceof Boolean || target === Boolean;
}

/**
 * Checks if a value is a primitive class constructor (String, Number, or Boolean).
 *
 * @public
 * @since v7.0.0
 */
export function isPrimitiveClass(target: any): boolean {
  // plain comparisons: no array allocated on each call
  return target === String || target === Number || target === Boolean;
}
