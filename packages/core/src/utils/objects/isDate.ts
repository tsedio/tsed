/**
 *
 * @param target
 * @returns {boolean}
 */
export function isDate(target: any): target is Date {
  return target === Date || (target instanceof Date && !isNaN(+target));
}
