/**
 *
 * @param target
 * @returns {boolean}
 */
export function isNumber(target: any): target is number {
  return typeof target === "number";
}

export function isNumberOrNumberClass(target: any): target is number {
  return typeof target === "number" || target instanceof Number || target === Number;
}
