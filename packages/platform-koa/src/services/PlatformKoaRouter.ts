import * as KoaRouter from "@koa/router";
import {RouterOptions as KoaRouterOptions} from "@koa/router";

import {PLATFORM_ROUTER_OPTIONS, PlatformHandler, PlatformMulter, PlatformMulterSettings, PlatformRouter} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import {ServerResponse} from "http";
import {getMulter} from "../utils/multer";

declare global {
  namespace TsED {
    export interface Router extends KoaRouter {}

    export interface RouterOptions extends KoaRouterOptions {}

    export interface StaticsOptions {
      maxage?: number;
      hidden?: boolean;
      index?: string | boolean | string[];
      defer?: boolean;
      brotli?: boolean;
      extensions?: false | string[] | undefined;

      // @ts-ignore
      setHeaders?(res: ServerResponse, path: string, stats: any): void;
    }
  }
}

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
}
