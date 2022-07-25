import {AsyncLocalStorage, AsyncResource} from "async_hooks";
import {DIContext} from "../domain/DIContext";

const storage: AsyncLocalStorage<DIContext> = new AsyncLocalStorage();

export function getAsyncStore() {
  return storage;
}

export function getContext<Context = DIContext>(): Context | undefined {
  return getAsyncStore().getStore() as any;
}

export function runInContext(ctx: DIContext, cb: any) {
  return storage.run(ctx, cb);
}

export function bindContext(cb: any) {
  return AsyncResource.bind(cb);
}
