import {nameOf} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {ExpressApplication, HandlerBuilder} from "../../mvc";

export function createExpressApplication(injector: InjectorService) {
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

  injector.forkProvider(ExpressApplication, expressApp);

  return expressApp;
}
