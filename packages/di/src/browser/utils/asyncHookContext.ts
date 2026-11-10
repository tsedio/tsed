import {DIContext, InjectorService} from "../../common/index.js";
import {hooks} from "@tsed/hooks";

interface AsyncStore {
  current: DIContext | undefined;
}

class AsyncContextStorage {
  private store?: AsyncStore;
  private stack: AsyncStore[] = [];

  run(store: AsyncStore, cb: (...args: any[]) => any) {
    this.stack.push(store);
    this.store = store;
    try {
      return cb();
    } finally {
      this.stack.pop();
      this.store = this.stack[this.stack.length - 1];
    }
  }

  getStore() {
    return this.store;
  }
}

const storage = new AsyncContextStorage();

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
 * Browser twin of the Node.js `runInContext`: run `cb` in the context of `ctx` and return its result as is, or a
 * promise of it when `cb` returns one or when the injector alters the callback first.
 *
 * @param ctx The context to run `cb` in.
 * @param cb The callback.
 * @param injector The injector used when `ctx` has none.
 * @returns The result of `cb`, or a promise of it.
 */
export function runInContext<Result = unknown>(
  ctx: DIContext | undefined,
  cb: (...args: unknown[]) => Result,
  injector?: {alterAsync?: (name: string, cb: any) => Promise<any>}
): Result | Promise<Awaited<Result>> {
  const ref = useContextRef();

  if (ref) {
    ctx && setContext(ctx);
    return cb();
  }

  injector = ctx?.injector || injector;

  // the InjectorService alter only dispatches to the $alterRunInContext listeners: skip it when there is none,
  // as the Node.js build does. A custom alterAsync is always called.
  const alterAsync = injector?.alterAsync;
  const mustAlter = alterAsync && (alterAsync !== InjectorService.prototype.alterAsync || hooks.has("$alterRunInContext"));

  if (mustAlter) {
    return alterAsync
      .call(injector, "$alterRunInContext", cb)
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
  return cb;
}

if (typeof window !== "undefined") {
  // Patch Promise.then pour propager le contexte
  const origThen = Promise.prototype.then;
  Promise.prototype.then = function <TResult1 = any, TResult2 = never>(
    onFulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    const ctx = useContextRef();
    return origThen.call(
      this,
      onFulfilled && ((v: any) => storage.run({current: ctx?.current}, () => onFulfilled(v))),
      onRejected && ((e: any) => storage.run({current: ctx?.current}, () => onRejected(e)))
    ) as Promise<TResult1 | TResult2>;
  };

  // Patch setTimeout pour propager le contexte
  const origSetTimeout = window.setTimeout;

  window.setTimeout = function (fn: any, ...args: any[]) {
    const ctx = useContextRef();
    return origSetTimeout(() => storage.run({current: ctx?.current}, fn), ...args);
  } as any;
}
