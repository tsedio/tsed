import {isArrayOrArrayClass} from "./isArray";

/**
 * Return true if the target.
 * @param target
 * @returns {boolean}
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
