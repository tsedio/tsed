/**
 * A value, or a promise of that value.
 *
 * Used by the APIs that continue in the same tick when a step returns a plain value, and wait only when it returns
 * a promise (see {@link chain}).
 *
 * @public
 */
export type MaybePromise<T> = T | Promise<T>;
