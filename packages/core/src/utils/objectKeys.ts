import {isProtectedKey} from "./isProtectedKey";

export function objectKeys(obj: any): string[] {
  return Object.keys(obj).filter((key) => !isProtectedKey(key));
}
