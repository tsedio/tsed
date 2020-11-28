/**
 *
 * @param target
 * @returns {boolean}
 */
export function isDate(target: any): boolean {
  return target === Date || (target instanceof Date && !isNaN(+target));
}
