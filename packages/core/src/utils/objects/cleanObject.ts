import {isProtectedKey} from "./isProtectedKey";
/**
 * Remove undefined value
 * @param obj
 * @param ignore
 */
export function cleanObject(obj: any, ignore: string[] = []): any {
  return Object.entries(obj).reduce((obj, [key, value]) => {
    if (isProtectedKey(key) || ignore.includes(key)) {
      return obj;
    }

    return value === undefined
      ? obj
      : {
          ...obj,
          [key]: value
        };
  }, {});
}
