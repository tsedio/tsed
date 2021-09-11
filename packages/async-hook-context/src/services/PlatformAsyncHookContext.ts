import {Inject, Injectable, InjectorService} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {AsyncLocalStorage} from "async_hooks";

let store: AsyncLocalStorage<any>;

@Injectable()
export class PlatformAsyncHookContext {
  @Inject()
  protected logger: Logger;

  @Inject()
  protected injector: InjectorService;

  static getStore() {
    store = store || new AsyncLocalStorage();
    return store;
  }

  static run(ctx: any, cb: any) {
    return PlatformAsyncHookContext.getStore().run(ctx, cb);
  }

  getContext() {
    return store?.getStore();
  }

  run = (ctx: any, cb: any) => {
    return PlatformAsyncHookContext.run(ctx, cb);
  };

  $onInit() {
    /* istanbul ignore */
    if (AsyncLocalStorage) {
      PlatformAsyncHookContext.getStore();
      // override
      this.injector.runInContext = this.run;
    } else {
      this.logger.warn(
        `AsyncLocalStorage is not available for your Node.js version (${process.versions.node}). Please upgrade your version at least to v13.10.0.`
      );
    }
  }
}
