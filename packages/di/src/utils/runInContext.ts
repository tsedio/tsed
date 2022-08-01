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
  if (getContext()) {
    let localArgs: any;
    const newCB: any = AsyncResource.bind(() => cb(...localArgs));

    // FIXME: remove this hack when the support of v14 will be removed
    // see issue: https://github.com/nodejs/node/issues/36051
    return (...args: any) => {
      localArgs = args;
      return newCB(...args);
    };
  }

  return cb;
}
