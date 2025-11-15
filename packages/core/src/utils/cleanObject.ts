import {isProtectedKey} from "./isProtectedKey.js";
/**
 * Returns a copy of an object with undefined values, protected keys, and ignored keys removed.
 *
 * Filters out entries that are undefined, match protected key patterns, or are in the ignore list.
 *
 * @public
 * @since v7.0.0
 * @see isProtectedKey
 */
export function cleanObject(obj: Record<string, unknown>, ignore: string[] = []): any {
  return Object.entries(obj).reduce(
    (obj, [key, value]) => {
      if (isProtectedKey(key) || ignore.includes(key) || value === undefined) {
        return obj;
      }

      obj[key] = value;

      return obj;
    },
    {} as Record<string, unknown>
  );
}
