import {isProtectedKey} from "./isProtectedKey.js";

export function objectKeys(obj: any): string[] {
  return Object.keys(obj).filter((key) => !isProtectedKey(key));
}
