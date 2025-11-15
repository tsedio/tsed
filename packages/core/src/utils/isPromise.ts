/**
 * Checks if a value is a Promise by verifying the then method exists and it's not an Observable.
 *
 * @public
 * @since v7.0.0
 * @see {@link https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects}
 */
export function isPromise<T = any>(target: any): target is Promise<T> {
  return (
    target === Promise ||
    target instanceof Promise ||
    (!!target && typeof target.subscribe !== "function" && typeof target.then === "function")
  );
}
