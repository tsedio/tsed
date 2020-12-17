import {
  PlatformApplication,
  PlatformBuilder,
  PlatformExceptions,
  PlatformHandler,
  PlatformRequest,
  PlatformResponse,
  PlatformRouter
} from "@tsed/common";
import {Type} from "@tsed/core";
import Koa from "koa";
import {PlatformKoaApplication, PlatformKoaHandler, PlatformKoaRequest, PlatformKoaResponse, PlatformKoaRouter} from "../services";

/**
 * @platform
 * @koa
 */
export class PlatformKoa extends PlatformBuilder {
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
}
