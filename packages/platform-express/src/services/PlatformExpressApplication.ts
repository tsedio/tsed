import {Configuration, createContext, Inject, PlatformApplication, PlatformHandler} from "@tsed/common";
import * as Express from "express";
import {PlatformExpressStaticsOptions} from "../interfaces/PlatformExpressStaticsOptions";
import {PlatformExpressRouter} from "./PlatformExpressRouter";

declare global {
  namespace TsED {
    export interface Application extends Express.Application {}

    export interface StaticsOptions extends PlatformExpressStaticsOptions {}
  }
}

/**
 * @platform
 * @express
 */
export class PlatformExpressApplication extends PlatformExpressRouter implements PlatformApplication<Express.Application> {
  app: Express.Application;
  rawApp: Express.Application;
  rawRouter: Express.Router;

  constructor(@Inject() platformHandler: PlatformHandler, @Configuration() configuration: Configuration) {
    super(platformHandler, configuration, {
      mergeParams: true
    });

    this.rawApp = configuration.get("express.app") || Express();

    this.useContext().getApp().use(this.getRouter());
  }

  getApp() {
    return this.rawApp;
  }

  callback() {
    return this.rawApp;
  }

  useContext(): this {
    this.getApp().use(async (req: any, res: any, next: any) => {
      await createContext(this.injector, req, res);

      return next();
    });

    return this;
  }
}
