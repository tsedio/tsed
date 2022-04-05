import KoaRouter, {RouterOptions as KoaRouterOptions} from "@koa/router";
import {
  createContext,
  InjectorService,
  PlatformAdapter,
  PlatformApplication,
  PlatformBuilder,
  PlatformExceptions,
  PlatformHandler,
  PlatformMulter,
  PlatformMulterSettings,
  PlatformRequest,
  PlatformResponse,
  PlatformStaticsOptions
} from "@tsed/common";
import {Type} from "@tsed/core";
import Koa, {Context, Next} from "koa";
import {resourceNotFoundMiddleware} from "../middlewares/resourceNotFoundMiddleware";
import {PlatformKoaResponse} from "../services/PlatformKoaResponse";
import {PlatformKoaRequest} from "../services/PlatformKoaRequest";
import {PlatformKoaHandler} from "../services/PlatformKoaHandler";
import {getMulter} from "../utils/multer";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";
import send from "koa-send";
// @ts-ignore
import koaQs from "koa-qs";

declare global {
  namespace TsED {
    export interface Application extends Koa {}
  }

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
    }
  ];

  constructor(private injector: InjectorService) {}

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
    const injector = this.injector;
    const app = this.injector.get<PlatformApplication>(PlatformApplication)!;

    const listener: any = (error: any, ctx: Koa.Context) => {
      injector.get<PlatformExceptions>(PlatformExceptions)?.catch(error, ctx.request.$ctx);
    };

    app.getApp().silent = true;
    app.getApp().on("error", listener);
  }

  useRouter(): this {
    const app = this.injector.get<PlatformApplication<Koa>>(PlatformApplication)!;

    app.getApp().use(resourceNotFoundMiddleware);
    app.getApp().use(app.getRouter().routes()).use(app.getRouter().allowedMethods());

    return this;
  }

  useContext(): this {
    const app = this.injector.get<PlatformApplication<Koa>>(PlatformApplication)!;
    const {logger} = this.injector;
    logger.info("Mount app context");

    const invoke = createContext(this.injector);

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

  app() {
    const app = this.injector.settings.get("koa.app") || new Koa();
    koaQs(app, "extended");

    return {
      app,
      callback() {
        return app.callback();
      }
    };
  }

  router(routerOptions: any = {}) {
    const {settings} = this.injector;

    const options = Object.assign({}, settings.koa?.router || {}, routerOptions);
    const router = new KoaRouter(options) as any;

    return {
      router,
      callback() {
        return [router.routes(), router.allowedMethods()];
      }
    };
  }

  multipart(options: PlatformMulterSettings): PlatformMulter {
    return getMulter(options);
  }

  statics(endpoint: string, options: PlatformStaticsOptions) {
    return staticsMiddleware(options);
  }
}
