import type {Type} from "../types/Type.js";

/**
 * Get the class constructor from a class or an instance.
 *
 * If `target` is already a constructor, it is returned as-is; otherwise the
 * constructor of the instance is returned.
 *
 * @param target A class constructor or an instance.
 * @returns The class constructor function.
 * @example
 * ```ts
 * class A {}
 * getConstructor(A) === A; // true
 * getConstructor(new A()) === A; // true
 * ```
 */
export function getConstructor(target: any): Type<any> {
  return typeof target === "function" ? target : target.constructor;
}

/**
 * Alias of `getConstructor`.
 * @see getConstructor
 */
export function constructorOf(target: any): Type<any> {
  return getConstructor(target);
}
