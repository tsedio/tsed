import {AsyncLocalStorage, AsyncResource} from "node:async_hooks";
import type {MaybePromise} from "@tsed/core";
import {hooks} from "@tsed/hooks";
import type {DIContext} from "../../common/domain/DIContext.js";
import {InjectorService} from "../../common/index.js";

const storage: AsyncLocalStorage<{current: DIContext | undefined}> = new AsyncLocalStorage();

export function getAsyncStore() {
  return storage;
}

export function useContextRef() {
  return getAsyncStore().getStore();
}

export function getContext<Context = DIContext>(initialValue?: DIContext): Context | undefined {
  return initialValue || (useContextRef()?.current as any);
}

/**
 * Run `cb` in the async context of `ctx` and return its result as is.
 *
 * A synchronous callback is called in the same tick and its value (or error) is returned (or thrown) directly: the
 * result is a promise only when `cb` returns one, or when the last `$alterRunInContext` listener returns a promise (see
 * below). Callers that `await` the result are unaffected.
 *
 * A `$alterRunInContext` listener returns the callback to run (see {@link AlterRunInContext}): the alter is synchronous.
 * For compatibility with the former async alter, a promise of the callback is still awaited when it is returned by the
 * last listener; an async setup belongs inside the returned callback.
 *
 * @param ctx The context to run `cb` in.
 * @param cb The callback.
 * @param _injector Unused, kept for compatibility: the `$alterRunInContext` listeners are global hooks.
 * @returns The result of `cb`, or a promise of it.
 */
export function runInContext<Result = unknown>(
  ctx: DIContext | undefined,
  cb: (...args: unknown[]) => Result,
  _injector?: InjectorService
): Result | Promise<Awaited<Result>> {
  const ref = useContextRef();

  if (ref) {
    ctx && setContext(ctx);
    return cb();
  }

  // a $alterRunInContext listener returns the callback to run (AlterRunInContext), so the alter is synchronous;
  // hooks.alter() returns cb as is when nobody listens. A promise returned by the last listener is awaited (compatibility).
  const altered = hooks.alter<typeof cb, MaybePromise<typeof cb> | undefined>("$alterRunInContext", cb);

  if (isThenable<typeof cb>(altered)) {
    return altered.then((next) => storage.run({current: ctx}, next || cb)) as Promise<Awaited<Result>>;
  }

  return storage.run({current: ctx}, altered || cb);
}

function isThenable<T>(value: unknown): value is Promise<T> {
  return !!value && typeof (value as Promise<T>).then === "function";
}

export function setContext(ctx: DIContext) {
  const ref = useContextRef();

  if (ref && !ref.current) {
    ref.current = ctx;
  }
}

/**
 * @deprecated
 */
export function bindContext(cb: any) {
  return AsyncResource.bind(cb);
}
