import {AsyncLocalStorage, AsyncResource} from "async_hooks";
import type {DIContext} from "../domain/DIContext";
import type {InjectorService} from "../services/InjectorService";

const storage: AsyncLocalStorage<{current: DIContext | undefined}> = new AsyncLocalStorage();

export function getAsyncStore() {
  return storage;
}

export function useContextRef() {
  return getAsyncStore().getStore();
}

export function getContext<Context = DIContext>(): Context | undefined {
  return useContextRef()?.current as any;
}

export async function runInContext(ctx: DIContext | undefined, cb: any, injector?: InjectorService) {
  const ref = useContextRef();

  if (ref) {
    ctx && setContext(ctx);
    return cb();
  } else {
    injector = ctx?.injector || injector;
    cb = (await injector?.alterAsync("$alterRunInContext", cb)) || cb;

    return storage.run({current: ctx}, cb);
  }
}

export function setContext(ctx: DIContext) {
  const ref = useContextRef();

  if (ref && !ref.current) {
    ref.current = ctx;
  }
}

export function bindContext(cb: any) {
  return AsyncResource.bind(cb);
}
