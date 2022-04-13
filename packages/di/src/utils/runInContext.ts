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
  return getAsyncStore().run(ctx, cb);
}
