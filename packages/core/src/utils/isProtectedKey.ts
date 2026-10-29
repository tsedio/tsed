/**
 * Checks if a key is a protected property name to prevent prototype pollution vulnerabilities.
 *
 * @public
 * @since v7.0.0
 */
export function isProtectedKey(key: string) {
  // plain comparisons: no array allocated on each call, this runs once per key in objectKeys() and cleanObject()
  return key === "__proto__" || key === "constructor" || key === "prototype";
}
