import KoaRouter from "@koa/router";
import {
  createContext,
  PlatformAdapter,
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
import {PlatformKoaResponse} from "../services/PlatformKoaResponse";
import {PlatformKoaRequest} from "../services/PlatformKoaRequest";
import {PlatformKoaHandler} from "../services/PlatformKoaHandler";
import {PlatformKoaRouter} from "../services/PlatformKoaRouter";
import {PlatformKoaApplication} from "../services/PlatformKoaApplication";

/**
 * @platform
 * @koa
 */
export class PlatformKoa implements PlatformAdapter<Koa, KoaRouter> {
  readonly providers = [
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

  constructor(private platform: PlatformBuilder<Koa, KoaRouter>) {}

  /**
   * Create new serverless application. In this mode, the component scan are disabled.
   * @param module
   * @param settings
   */
  static create(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.create<Koa, KoaRouter>(module, {
      ...settings,
      adapter: PlatformKoa
    });
  }

  /**
   * Bootstrap a server application
   * @param module
   * @param settings
   */
  static async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.bootstrap<Koa, KoaRouter>(module, {
      ...settings,
      adapter: PlatformKoa
    });
  }

  onInit() {
    const {injector, app} = this.platform;

    const listener: any = (error: any, ctx: Koa.Context) => {
      injector.get<PlatformExceptions>(PlatformExceptions)?.catch(error, ctx.request.$ctx);
    };

    app.getApp().silent = true;
    app.getApp().on("error", listener);
  }

  useRouter(): this {
    const {app} = this.platform;
    app.getApp().use(resourceNotFoundMiddleware).use(app.getRouter().routes()).use(app.getRouter().allowedMethods());

    return this;
  }

  useContext(): this {
    const {injector, app, logger} = this.platform;
    logger.info("Mount app context");

    const invoke = createContext(injector);

    app.getApp().use(async (ctx: Context, next: Next) => {
      await invoke({
        request: ctx.request as any,
        response: ctx.response as any,
        ctx
      });

      return next();
    });

    return this;
  }
}
