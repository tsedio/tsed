/**
 * Checks if a value is an array.
 *
 * @public
 * @since v7.0.0
 */
export function isArray<T = any>(target: unknown): target is T[] {
  return Array.isArray(target);
}

/**
 * Checks if a value is the Array constructor or an array instance.
 *
 * @public
 * @since v7.0.0
 */
export function isArrayOrArrayClass<T = any>(target: unknown): target is T[] {
  return target === Array || isArray(target);
}
