import * as KoaRouter from "@koa/router";
import {Configuration, createContext, Inject, PlatformApplication, PlatformHandler, PlatformStaticsOptions} from "@tsed/common";
import * as Koa from "koa";
import KoaApplication, {Context, Next} from "koa";
import * as mount from "koa-mount";
import * as statics from "koa-static";
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

  use(...handlers: any[]) {
    if (handlers.length) {
      handlers = this.mapHandlers(handlers);
      // @ts-ignore
      this.getApp().use(mount(...handlers));
    }

    return this;
  }

  useContext(): this {
    this.getApp().use(async (ctx: Context, next: Next) => {
      await createContext(this.injector, ctx.request, ctx.response);

      return next();
    });

    return this;
  }

  statics(path: string, options: PlatformStaticsOptions) {
    const {root, ...props} = options;
    this.use(path, statics(root, props as any));

    return this;
  }
}
