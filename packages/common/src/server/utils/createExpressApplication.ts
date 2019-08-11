import {InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import * as Express from "express";
import {HandlerBuilder} from "../../mvc";
import {ExpressApplication} from "../decorators/expressApplication";

export function createExpressApplication(injector: InjectorService): void {
  injector.forkProvider(ExpressApplication);
}

registerProvider({
  provide: ExpressApplication,
  deps: [InjectorService],
  scope: ProviderScope.SINGLETON,
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
