import KoaRouter, {RouterOptions as KoaRouterOptions} from "@koa/router";
import {
  createContext,
  HandlerMetadata,
  HandlerType,
  PlatformAdapter,
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
import {PlatformKoaHandler, PlatformKoaRequest, PlatformKoaResponse} from "../services";
import {getMulter} from "../utils/multer";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";
import send from "koa-send";

const koaQs = require("koa-qs");

declare global {
  namespace TsED {
    export interface Application extends Koa {}

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
export class PlatformKoa extends PlatformAdapter<Koa, KoaRouter> {
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

  createApp() {
    const app = this.injector.settings.get("koa.app") || new Koa();
    koaQs(app, "extended");

    const listener: any = (error: any, ctx: Koa.Context) => {
      this.injector.get<PlatformExceptions>(PlatformExceptions)?.catch(error, ctx.request.$ctx);
    };

    app.silent = true;
    app.on("error", listener);

    return app;
  }

  callback(app: Koa): any {
    return app.callback();
  }

  createRouter(options: any) {
    const routerOptions = this.injector.settings.get("koa.router", {});
    options = Object.assign({}, routerOptions, options);

    return new KoaRouter(options) as any;
  }

  bindRouter(router: KoaRouter) {
    return [router.routes(), router.allowedMethods()];
  }

  useRouter(): this {
    this.app.getApp().use(resourceNotFoundMiddleware).use(this.app.getRouter().routes()).use(this.app.getRouter().allowedMethods());

    return this;
  }

  useContext(): this {
    this.injector.logger.info("Mount app context");

    const invoke = createContext(this.injector);

    this.app.getApp().use(async (ctx: Context, next: Next) => {
      await invoke({
        request: ctx.request as any,
        response: ctx.response as any,
        ctx
      });

      return next();
    });

    return this;
  }

  multer(options: PlatformMulterSettings): PlatformMulter {
    return getMulter(options);
  }

  statics(path: string, options: PlatformStaticsOptions) {
    return staticsMiddleware(options);
  }

  createHandler(metadata: HandlerMetadata, compileHandler: () => (scope: Record<string, any>) => void): any {
    switch (metadata.type) {
      case HandlerType.ENDPOINT:
      case HandlerType.MIDDLEWARE:
      case HandlerType.ERR_MIDDLEWARE:
      case HandlerType.CTX_FN:
        const handler = compileHandler();
        return async (ctx: Koa.Context, next: Koa.Next) => handler({next, $ctx: ctx.request.$ctx});
      default:
        return super.createHandler(metadata, compileHandler);
    }
  }
}
