import KoaRouter from "@koa/router";
import {
  createContext,
  PlatformApplication,
  PlatformBuilder,
  PlatformExceptions,
  PlatformHandler,
  PlatformRequest,
  PlatformResponse,
  PlatformRouter
} from "@tsed/common";
import {Type} from "@tsed/core";
import Koa, {Context, Next} from "koa";
import {resourceNotFoundMiddleware} from "../middlewares/resourceNotFoundMiddleware";
import {PlatformKoaApplication, PlatformKoaHandler, PlatformKoaRequest, PlatformKoaResponse, PlatformKoaRouter} from "../services";

/**
 * @platform
 * @koa
 */
export class PlatformKoa extends PlatformBuilder<Koa, KoaRouter> {
  static providers = [
    {
      provide: PlatformResponse,
      useClass: PlatformKoaResponse
    },
    {
      provide: PlatformRequest,
      useClass: PlatformKoaRequest
    },
    {
      provide: PlatformHandler,
      useClass: PlatformKoaHandler
    },
    {
      provide: PlatformRouter,
      useClass: PlatformKoaRouter
    },
    {
      provide: PlatformApplication,
      useClass: PlatformKoaApplication
    }
  ];

  static async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}): Promise<PlatformKoa> {
    return this.build<PlatformKoa>(PlatformKoa).bootstrap(module, settings);
  }

  protected createInjector(module: Type<any>, settings: any) {
    super.createInjector(module, settings);

    const listener: any = (error: any, ctx: Koa.Context) => {
      this.injector.get<PlatformExceptions>(PlatformExceptions)?.catch(error, ctx.request.$ctx);
    };

    this.app.getApp().silent = true;
    this.app.getApp().on("error", listener);
  }

  protected useRouter(): this {
    this.app.getApp().use(resourceNotFoundMiddleware).use(this.app.getRouter().routes()).use(this.app.getRouter().allowedMethods());

    return this;
  }

  protected useContext(): this {
    this.app.getApp().use(async (ctx: Context, next: Next) => {
      await createContext(this.injector, ctx.request, ctx.response);

      return next();
    });

    return this;
  }
}
