/**
 * Checks if a value is the Date constructor or a valid Date instance.
 *
 * @public
 * @since v7.0.0
 */
export function isDate(target: any): target is Date {
  return target === Date || (target instanceof Date && !isNaN(+target));
}
