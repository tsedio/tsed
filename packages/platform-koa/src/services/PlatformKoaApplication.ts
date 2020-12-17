import KoaRouter from "@koa/router";
import {Configuration, createContext, Inject, PlatformApplication, PlatformHandler} from "@tsed/common";
import Koa from "koa";
import KoaApplication, {Context, Next} from "koa";
import {resourceNotFoundMiddleware} from "../middlewares/resourceNotFoundMiddleware";
import {PlatformKoaRouter} from "./PlatformKoaRouter";

declare global {
  namespace TsED {
    export interface Application extends Koa {}
  }
}

/**
 * @platform
 * @express
 */
export class PlatformKoaApplication extends PlatformKoaRouter implements PlatformApplication<Koa, KoaRouter> {
  app: KoaApplication;
  rawApp: KoaApplication;

  constructor(@Inject() platformHandler: PlatformHandler, @Configuration() configuration: Configuration) {
    super(platformHandler, configuration, {});

    this.rawApp = configuration.get("koa.app") || new Koa();

    this.useContext().getApp().use(resourceNotFoundMiddleware).use(this.getRouter().routes()).use(this.getRouter().allowedMethods());
  }

  getApp(): KoaApplication {
    return this.rawApp;
  }

  callback(): any {
    return this.getApp().callback();
  }

  useContext(): this {
    this.getApp().use(async (ctx: Context, next: Next) => {
      await createContext(this.injector, ctx.request, ctx.response);

      return next();
    });

    return this;
  }
}
