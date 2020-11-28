export function isArray<T = any>(target: any): target is T[] {
  return Array.isArray(target);
}

/**
 * Return true if the clazz is an array.
 * @param target
 * @returns {boolean}
 */
export function isArrayOrArrayClass(target: any): boolean {
  return target === Array || isArray(target);
}
