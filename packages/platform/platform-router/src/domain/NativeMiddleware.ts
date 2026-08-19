/** Explicit wrapper for middleware owned by a host framework. */
export interface NativeMiddleware<T = unknown> {
  readonly handler: T;
  readonly native: true;
}

export function createNativeMiddleware<T>(handler: T): NativeMiddleware<T> {
  return {handler, native: true};
}

export function isNativeMiddleware(value: unknown): value is NativeMiddleware {
  return Boolean(value && typeof value === "object" && (value as NativeMiddleware).native === true);
}
