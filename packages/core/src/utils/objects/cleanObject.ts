import {isProtectedKey} from "./isProtectedKey.js";
/**
 * Remove undefined value
 * @param obj
 * @param ignore
 */
export function cleanObject(obj: Record<string, unknown>, ignore: string[] = []): any {
  return Object.entries(obj).reduce((obj, [key, value]) => {
    if (isProtectedKey(key) || ignore.includes(key) || value === undefined) {
      return obj;
    }

    obj[key] = value;

    return obj
  }, {} as Record<string, unknown>);
}
