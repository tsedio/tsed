import Router from "@koa/router";
import {
  createContext,
  PlatformApplication,
  PlatformBuilder,
  PlatformExceptions,
  PlatformHandler,
  PlatformRequest,
  PlatformResponse,
  PlatformRouteStack
} from "@tsed/common";
import {Type} from "@tsed/core";
import Koa, {Context, Next} from "koa";
import {resourceNotFoundMiddleware} from "../middlewares/resourceNotFoundMiddleware";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";
import {PlatformKoaApplication, PlatformKoaHandler, PlatformKoaRequest, PlatformKoaResponse} from "../services";

/**
 * @platform
 * @koa
 */
export class PlatformKoa extends PlatformBuilder<Koa, Router> {
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
      provide: PlatformApplication,
      useClass: PlatformKoaApplication
    }
  ];

  static async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}): Promise<PlatformKoa> {
    return this.build<PlatformKoa>(PlatformKoa).bootstrap(module, settings);
  }

  protected configure(): this {
    this.logger.info("Mount app context");

    const listener: any = (error: any, ctx: Koa.Context) => {
      this.injector.get<PlatformExceptions>(PlatformExceptions)?.catch(error, ctx.request.$ctx);
    };

    this.app.getApp().silent = true;
    this.app.getApp().on("error", listener);
    this.app.getApp().use(async (ctx: Context, next: Next) => {
      await createContext(this.injector, this.createRequest(ctx.request), this.createResponse(ctx.response));

      return next();
    });
    this.app.getApp().use(resourceNotFoundMiddleware);

    return this;
  }

  protected async loadRoutes(): Promise<void> {
    await super.loadRoutes();
    this.app.getApp().use(this.app.getRouter().routes()).use(this.app.getRouter().allowedMethods());
  }

  protected processStack(stack: PlatformRouteStack) {
    console.log(stack.path);
    switch (stack.method) {
      case "statics":
        this.app.getRouter().use(stack.path as string, staticsMiddleware(stack.options));
        break;

      default:
        super.processStack(stack);
        break;
    }

    console.log(this.app.getRouter());
    return this;
  }
}
