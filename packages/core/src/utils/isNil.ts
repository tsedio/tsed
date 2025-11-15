/**
 * Checks if a value is null or undefined.
 *
 * @public
 * @since v7.0.0
 */
export function isNil(value: any): boolean {
  return value === undefined || value === null;
}
