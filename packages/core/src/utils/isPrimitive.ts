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
 * Constructors (`String`, `Number`, `Boolean`) and boxed values are not accepted.
 * Use {@link isPrimitiveOrPrimitiveClass} to accept them.
 *
 * @public
 * @since v7.0.0
 */
export function isPrimitive(target: any): boolean {
  const type = typeof target;

  // inlined isString() || isNumber() || isBoolean(): called per value
  return type === "string" || type === "number" || type === "boolean";
}

/**
 * Checks if a value is a primitive class constructor (String, Number, or Boolean).
 *
 * @public
 * @since v7.0.0
 */
export function isPrimitiveClass(target: any): boolean {
  return [String, Number, Boolean].includes(target);
}
