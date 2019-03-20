import {InjectorService, ProviderScope, registerProvider} from "@tsed/common";
import * as Express from "express";
import {ExpressApplication, HandlerBuilder} from "../../mvc";

export async function createExpressApplication(injector: InjectorService): Promise<void> {
  await injector.forkProvider(ExpressApplication);
}

registerProvider({
  provide: ExpressApplication,
  deps: [InjectorService],
  scope: ProviderScope.SINGLETON,
  buildable: false,
  global: true,
  useFactory(injector: InjectorService) {
    const expressApp = Express();
    const originalUse = expressApp.use;

    expressApp.use = function(...args: any[]) {
      args = args.map(arg => {
        if (injector.has(arg)) {
          arg = HandlerBuilder.from(arg).build(injector);
        }

        return arg;
      });

      return originalUse.call(this, ...args);
    };

    return expressApp;
  }
});
