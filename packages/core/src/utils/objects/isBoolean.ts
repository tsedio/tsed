/**
 *
 * @param target
 * @returns {boolean}
 */
export function isBoolean(target: any): target is boolean {
  return typeof target === "boolean" || target instanceof Boolean || target === Boolean;
}
