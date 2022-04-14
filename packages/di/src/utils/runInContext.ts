import {AsyncLocalStorage} from "async_hooks";
import {DIContext} from "../domain/DIContext";

let store: AsyncLocalStorage<DIContext>;

export function getAsyncStore() {
  store = store || new AsyncLocalStorage();
  return store;
}

export function getContext() {
  return store?.getStore();
}

export function runInContext(ctx: DIContext, cb: any) {
  // istanbul ignore else
  return AsyncLocalStorage ? getAsyncStore().run(ctx, cb) : cb();
}
