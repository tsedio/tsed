import {Configuration, Inject, PlatformApplication, PlatformHandler} from "@tsed/common";
import Express from "express";
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
export class PlatformExpressApplication extends PlatformExpressRouter implements PlatformApplication<Express.Application, Express.Router> {
  app: Express.Application;
  rawApp: Express.Application;
  rawRouter: Express.Router;

  constructor(@Inject() platformHandler: PlatformHandler, @Configuration() configuration: Configuration) {
    super(platformHandler, configuration, {
      mergeParams: true
    });

    this.rawApp = configuration.get("express.app") || Express();
  }

  getApp() {
    return this.rawApp;
  }

  callback() {
    return this.rawApp;
  }
}
