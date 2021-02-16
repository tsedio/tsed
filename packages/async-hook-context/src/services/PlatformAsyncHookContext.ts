import {Inject, Injectable, PlatformContext, PlatformHandler} from "@tsed/common";
import {Logger} from "@tsed/logger";
import {AsyncLocalStorage} from "async_hooks";

@Injectable()
export class PlatformAsyncHookContext {
  @Inject()
  protected logger: Logger;

  @Inject()
  protected platformHandler: PlatformHandler;

  protected store: AsyncLocalStorage<PlatformContext>;

  getContext() {
    return this.store?.getStore();
  }

  $onInit() {
    /* istanbul ignore */
    if (AsyncLocalStorage) {
      this.store = new AsyncLocalStorage();
      // override
      this.platformHandler.run = (ctx: PlatformContext, cb: any) => {
        return this.store.run(ctx, cb);
      };
    } else {
      this.logger.warn(
        `AsyncLocalStorage is not available for your Node.js version (${process.versions.node}). Please upgrade your version at least to v13.10.0.`
      );
    }
  }
}
