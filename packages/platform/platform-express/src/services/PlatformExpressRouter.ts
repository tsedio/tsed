import {PLATFORM_ROUTER_OPTIONS, PlatformHandler, PlatformRouter, PlatformStaticsOptions} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import Express from "express";
import {RouterOptions} from "express";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";

declare global {
  namespace TsED {
    export interface Router extends Express.Router {}
  }
}

/**
 * @platform
 * @express
 */
export class PlatformExpressRouter extends PlatformRouter<Express.Router> {
  constructor(
    platform: PlatformHandler,
    @Configuration() configuration: Configuration,
    @Inject(PLATFORM_ROUTER_OPTIONS) routerOptions: Partial<RouterOptions> = {}
  ) {
    super(platform);

    const options = Object.assign(
      {
        mergeParams: true
      },
      configuration.express?.router || {},
      routerOptions
    );
    this.rawRouter = this.raw = Express.Router(options);
  }

  statics(endpoint: string, options: PlatformStaticsOptions) {
    const {root, ...props} = options;

    this.use(endpoint, staticsMiddleware(root, props));

    return this;
  }
}
