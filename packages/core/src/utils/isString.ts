/**
 * @param target
 * @returns {boolean}
 */
export function isString(target: any): target is string {
  return typeof target === "string";
}

export function isStringOrStringClass(target: any): target is string {
  return typeof target === "string" || target instanceof String || target === String;
}
