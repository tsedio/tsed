import * as KoaRouter from "@koa/router";
import {RouterOptions as KoaRouterOptions} from "@koa/router";

import {
  PLATFORM_ROUTER_OPTIONS,
  PlatformHandler,
  PlatformMulter,
  PlatformMulterSettings,
  PlatformRouter,
  PlatformStaticsOptions
} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import * as send from "koa-send";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";
import {getMulter} from "../utils/multer";

declare global {
  namespace TsED {
    export interface Router extends KoaRouter {}

    export interface RouterOptions extends KoaRouterOptions {}

    export interface StaticsOptions extends send.SendOptions {}
  }
}

// @ts-ignore
KoaRouter.prototype.$$match = KoaRouter.prototype.match;
KoaRouter.prototype.match = function match(...args: any[]) {
  const matched = this.$$match(...args);
  if (matched) {
    if (matched.path.length) {
      matched.route = true;
    }
  }

  return matched;
};

export class PlatformKoaRouter extends PlatformRouter<KoaRouter> {
  constructor(
    platform: PlatformHandler,
    @Configuration() configuration: Configuration,
    @Inject(PLATFORM_ROUTER_OPTIONS) routerOptions: any
  ) {
    super(platform);

    const options = Object.assign({}, configuration.koa?.router || {}, routerOptions);
    this.rawRouter = new KoaRouter(options) as any;
  }

  callback() {
    return [this.getRouter().routes(), this.getRouter().allowedMethods()];
  }

  multer(options: PlatformMulterSettings): PlatformMulter {
    return getMulter(options);
  }

  statics(path: string, options: PlatformStaticsOptions) {
    this.rawRouter.use(path, staticsMiddleware(options) as any);

    return this;
  }
}
