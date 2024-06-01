import {isEnumerable} from "./isEnumerable.js";
import {isProtectedKey} from "./isProtectedKey.js";

/**
 * Return all enumerable keys of the given object
 * @param obj
 */
export function getEnumerableKeys(obj: any) {
  const keys: string[] = [];

  for (const key in obj) {
    if (!isProtectedKey(key) && isEnumerable(obj, key)) {
      keys.push(key);
    }
  }

  return keys;
}
