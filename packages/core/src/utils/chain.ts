import type {MaybePromise} from "../types/MaybePromise.js";
import {isPromise} from "./isPromise.js";

/**
 * Call `onValue` with `value`, in the same tick when `value` is not a promise, or once it resolves otherwise.
 *
 * A rejected promise calls `onError` when it is given, and stays rejected otherwise. Use it to continue a pipeline
 * synchronously when a step did not need to wait, e.g. `chain($ctx.start(), done, done)`.
 *
 * @param value A value or a promise of it.
 * @param onValue Called with the value.
 * @param onError Called with the rejection reason of `value`.
 * @returns The result of `onValue` (or `onError`), or a promise of it when `value` is a promise.
 * @public
 */
export function chain<T, R>(value: MaybePromise<T>, onValue: (value: T) => R, onError?: (error: unknown) => R): MaybePromise<R> {
  return isPromise<T>(value) ? value.then(onValue, onError) : onValue(value);
}
