/**
 * Checks if a value is a RegExp instance.
 *
 * @public
 * @since v7.0.0
 */
export function isRegExp(target: any): target is RegExp {
  return target instanceof RegExp;
}
