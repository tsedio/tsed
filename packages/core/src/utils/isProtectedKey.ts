/**
 * Checks if a key is a protected property name to prevent prototype pollution vulnerabilities.
 *
 * @public
 * @since v7.0.0
 */
export function isProtectedKey(key: string) {
  return ["__proto__", "constructor", "prototype"].includes(key);
}
