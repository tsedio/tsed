import {AsyncLocalStorage, AsyncResource} from "node:async_hooks";
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
 * result is a promise only when `cb` returns one, or when a `$alterRunInContext` listener has to be awaited first.
 * Callers that `await` the result are unaffected.
 *
 * @param ctx The context to run `cb` in.
 * @param cb The callback.
 * @param injector The injector used when `ctx` has none.
 * @returns The result of `cb`, or a promise of it.
 */
export function runInContext<Result = unknown>(
  ctx: DIContext | undefined,
  cb: (...args: unknown[]) => Result,
  injector?: InjectorService
): Result | Promise<Awaited<Result>> {
  const ref = useContextRef();

  if (ref) {
    ctx && setContext(ctx);
    return cb();
  }

  injector = ctx?.injector || injector;

  // Skip the async alter (one more promise per request) when no module listens to $alterRunInContext.
  if (injector && hooks.has("$alterRunInContext")) {
    return injector
      .alterAsync("$alterRunInContext", cb)
      .then((altered: typeof cb | undefined) => storage.run({current: ctx}, altered || cb)) as Promise<Awaited<Result>>;
  }

  return storage.run({current: ctx}, cb);
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
