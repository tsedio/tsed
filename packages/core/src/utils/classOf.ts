/**
 * Returns the constructor of a target. If `target` is already a class
 * (constructor function), it is returned as is; if it is an instance,
 * its constructor is returned.
 *
 * @param target Instance or constructor.
 * @returns The constructor associated with the target.
 * @example
 * ```ts
 * class A {}
 * getClass(A) === A; // true
 * getClass(new A()) === A; // true
 * ```
 */
export function getClass(target: any): any {
  return target.prototype ? target : target.constructor;
}

/**
 * Alias of `getClass`.
 * @see getClass
 */
export function classOf(target: any) {
  return getClass(target);
}
