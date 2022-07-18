import {AsyncLocalStorage} from "async_hooks";
import {DIContext} from "../domain/DIContext";

const storage: AsyncLocalStorage<DIContext> = new AsyncLocalStorage();

export function getAsyncStore() {
  return storage;
}

export function getContext<Context = DIContext>(): Context | undefined {
  return storage.getStore() as any;
}

export function runInContext(ctx: DIContext, cb: any) {
  return storage.run(ctx, cb);
}
