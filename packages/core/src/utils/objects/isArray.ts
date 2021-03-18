/**
 * Return true if value is an array
 * @param target
 * @returns {boolean}
 */
export function isArray<T = any>(target: unknown): target is T[] {
  return Array.isArray(target);
}

/**
 * Return true if the clazz is an array.
 * @param target
 * @returns {boolean}
 * @ignore
 */
export function isArrayOrArrayClass<T = any>(target: unknown): target is T[] {
  return target === Array || isArray(target);
}
