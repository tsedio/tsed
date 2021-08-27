/**
 * Tests to see if the object is an ES2015 (ES6) Promise
 * @see {@link https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects}
 * @param target
 * @returns {boolean}
 */
export function isPromise<T = any>(target: any): target is Promise<T> {
  return (
    target === Promise ||
    target instanceof Promise ||
    (!!target && typeof target.subscribe !== "function" && typeof target.then === "function")
  );
}
