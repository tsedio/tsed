import {toStringConstructor} from "./toStringConstructor.js";

/**
 * Extracts constructor parameter names from a class constructor.
 *
 * Parses the constructor's string representation to retrieve parameter names.
 * Returns an array of trimmed, non-empty parameter names.
 *
 * @public
 * @since v7.0.0
 * @see toStringConstructor
 */
export function getConstructorArgNames(target: any) {
  return toStringConstructor(target)
    .split("constructor(")[1]
    .split(")")[0]
    .split(", ")
    .filter(Boolean)
    .map((s) => s.trim());
}
