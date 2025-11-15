import {isArrayOrArrayClass} from "./isArray.js";

/**
 * Determines whether a value is a collection type (Array, Map, Set, WeakMap, WeakSet).
 *
 * Checks both the constructor itself and instances of these collection types.
 *
 * @public
 * @since v7.0.0
 */
export function isCollection(target: any): boolean {
  return (
    isArrayOrArrayClass(target) ||
    target === Map ||
    target instanceof Map ||
    target === Set ||
    target instanceof Set ||
    target === WeakMap ||
    target instanceof WeakMap ||
    target === WeakSet ||
    target instanceof WeakSet
  );
}
