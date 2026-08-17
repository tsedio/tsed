/**
 * Portable execution facilities offered by a Fetch runtime.
 */
export interface PlatformRuntimeContext {
  signal?: AbortSignal;
  waitUntil?(promise: Promise<unknown>): void;
}
