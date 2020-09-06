import {PLATFORM_ROUTER_OPTIONS, PlatformHandler, PlatformRouter, PlatformStaticsOptions} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import * as Express from "express";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";
import {PlatformExpressDriver} from "./PlatformExpressDriver";

declare global {
  namespace TsED {
    export interface Router extends Express.Router {
    }
  }
}

/**
 * @platform
 * @express
 */
export class PlatformExpressRouter extends PlatformExpressDriver<Express.Router> {
  constructor(
    platform: PlatformHandler,
    @Configuration() configuration: Configuration,
    @Inject(PLATFORM_ROUTER_OPTIONS) routerOptions: any
  ) {
    super(platform);

    const options = Object.assign({}, configuration.express?.router || {}, routerOptions);
    this.raw = Express.Router(options);
  }
}
