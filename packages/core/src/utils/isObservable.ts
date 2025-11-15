/**
 * Checks if an object is an RxJS Observable by verifying lift and subscribe methods.
 *
 * @public
 * @since v7.0.0
 */
export function isObservable<T>(obj: any): boolean {
  return !!obj && typeof obj.lift === "function" && typeof obj.subscribe === "function";
}
