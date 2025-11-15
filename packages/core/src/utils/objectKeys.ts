import {isProtectedKey} from "./isProtectedKey.js";

/**
 * Returns object keys excluding protected keys like constructor and prototype.
 *
 * @public
 * @since v7.0.0
 */
export function objectKeys(obj: any): string[] {
  return Object.keys(obj).filter((key) => !isProtectedKey(key));
}
