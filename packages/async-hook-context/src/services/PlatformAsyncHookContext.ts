import {Inject, Injectable, PlatformContext, PlatformHandler, PlatformTest} from "@tsed/common";
import {Logger} from "@tsed/logger";
import {AsyncLocalStorage} from "async_hooks";

let store: AsyncLocalStorage<PlatformContext>;

@Injectable()
export class PlatformAsyncHookContext {
  @Inject()
  protected logger: Logger;

  @Inject()
  protected platformHandler: PlatformHandler;

  getContext() {
    return store?.getStore();
  }

  static getStore() {
    store = store || new AsyncLocalStorage();
    return store;
  }

  run = (ctx: PlatformContext, cb: any) => {
    return PlatformAsyncHookContext.run(ctx, cb);
  };

  $onInit() {
    /* istanbul ignore */
    if (AsyncLocalStorage) {
      PlatformAsyncHookContext.getStore();
      // override
      this.platformHandler.run = this.run;
    } else {
      this.logger.warn(
        `AsyncLocalStorage is not available for your Node.js version (${process.versions.node}). Please upgrade your version at least to v13.10.0.`
      );
    }
  }

  static run(ctx: PlatformContext, cb: any) {
    return PlatformAsyncHookContext.getStore().run(ctx, cb);
  }
}
