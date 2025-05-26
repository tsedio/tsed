/**
 * Prevent prototype pollution vulnerability
 * @param key
 */
export function isProtectedKey(key: string) {
  return ["__proto__", "constructor", "prototype"].includes(key);
}
