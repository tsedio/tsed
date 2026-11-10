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

export async function runInContext<Result = unknown>(
  ctx: DIContext | undefined,
  cb: (...args: unknown[]) => Result,
  injector?: InjectorService
): Promise<Result> {
  const ref = useContextRef();

  if (ref) {
    ctx && setContext(ctx);
    return cb();
  } else {
    injector = ctx?.injector || injector;

    // Skip the async alter (one more promise per request) when no module listens to $alterRunInContext.
    if (injector && hooks.has("$alterRunInContext")) {
      cb = (await injector.alterAsync("$alterRunInContext", cb)) || cb;
    }

    return storage.run({current: ctx}, cb);
  }
}

/**
 * Run `cb` in the async context of `ctx`, like {@link runInContext}, and return its result as is: a synchronous
 * callback is not wrapped in a promise. A promise is returned when `cb` returns one, or when a `$alterRunInContext`
 * listener has to be awaited.
 *
 * @param ctx The context to run `cb` in.
 * @param cb The callback.
 * @param injector The injector used when `ctx` has none.
 * @returns The result of `cb`, or a promise of it.
 */
export function callInContext<Result = unknown>(
  ctx: DIContext | undefined,
  cb: (...args: unknown[]) => Result,
  injector?: InjectorService
): Result | Promise<Awaited<Result>> {
  const ref = useContextRef();

  if (ref) {
    ctx && setContext(ctx);
    return cb();
  }

  if ((ctx?.injector || injector) && hooks.has("$alterRunInContext")) {
    return runInContext(ctx, cb, injector) as Promise<Awaited<Result>>;
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
