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
export function cleanObject(obj: Record<string, unknown>, ignore?: string[]): any {
  const out: Record<string, unknown> = {};
  // plain loop over Object.keys(): no [key, value] tuple per entry, and no includes() when nothing is ignored
  const keys = Object.keys(obj);
  const hasIgnore = !!ignore && ignore.length > 0;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];

    if (value === undefined || isProtectedKey(key) || (hasIgnore && ignore!.includes(key))) {
      continue;
    }

    out[key] = value;
  }

  return out;
}
