import {isProtectedKey} from "./isProtectedKey.js";

/**
 * Returns object keys excluding protected keys like constructor and prototype.
 *
 * @public
 * @since v7.0.0
 */
export function objectKeys(obj: any): string[] {
  const keys = Object.keys(obj);

  // a protected key is rare: Object.keys() already returns a new array, filter it only when needed
  for (let i = 0; i < keys.length; i++) {
    if (isProtectedKey(keys[i])) {
      return keys.filter((key) => !isProtectedKey(key));
    }
  }

  return keys;
}
