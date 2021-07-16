import {Configuration, Inject, PlatformApplication, PlatformHandler} from "@tsed/common";
import Express from "express";
import {PlatformExpressStaticsOptions} from "../interfaces/PlatformExpressStaticsOptions";

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
export class PlatformExpressApplication extends PlatformApplication<Express.Application> {
  constructor(@Inject() platformHandler: PlatformHandler, @Configuration() configuration: Configuration) {
    super();

    this.raw = this.rawRouter = configuration.get<Express.Application>("express.app", Express());
  }
}
