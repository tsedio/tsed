import KoaRouter from "@koa/router";
import {catchAsyncError, isFunction, Type} from "@tsed/core";
import {runInContext} from "@tsed/di";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {
  createContext,
  PlatformAdapter,
  PlatformBuilder,
  PlatformHandler,
  PlatformMulter,
  PlatformMulterSettings,
  PlatformProvider,
  PlatformRequest,
  PlatformResponse,
  PlatformStaticsOptions
} from "@tsed/platform-http";
import {PlatformHandlerMetadata, PlatformHandlerType, PlatformLayer} from "@tsed/platform-router";
import Koa, {Context, Next} from "koa";
import koaBodyParser, {Options} from "koa-bodyparser";
// @ts-ignore
import koaQs from "koa-qs";
import send from "koa-send";

import {staticsMiddleware} from "../middlewares/staticsMiddleware.js";
import {PlatformKoaHandler} from "../services/PlatformKoaHandler.js";
import {PlatformKoaRequest} from "../services/PlatformKoaRequest.js";
import {PlatformKoaResponse} from "../services/PlatformKoaResponse.js";
import {getMulter} from "../utils/multer.js";

declare global {
  namespace TsED {
    export interface Application extends Koa {}
  }

  namespace TsED {
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
@PlatformProvider()
export class PlatformKoa extends PlatformAdapter<Koa> {
  static readonly NAME = "koa";

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
    return PlatformBuilder.create<Koa>(module, {
      ...settings,
      adapter: PlatformKoa
    });
  }

  /**
   * Bootstrap a server application
   * @param module
   * @param settings
   */
  static bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.bootstrap<Koa>(module, {
      ...settings,
      adapter: PlatformKoa
    });
  }

  onInit() {
    this.app.getApp().silent = true;
  }

  mapLayers(layers: PlatformLayer[]) {
    const {settings} = this.injector;
    const {app} = this;
    const options = settings.get("koa.router", {});
    const rawRouter = new KoaRouter(options) as any;

    layers.forEach((layer) => {
      switch (layer.method) {
        case "statics":
          rawRouter.use(layer.path, this.statics(layer.path as string, layer.opts as any));
          break;

        default:
          rawRouter[layer.method](...layer.getArgs());
      }
    });

    app.getApp().use(rawRouter.routes()).use(rawRouter.allowedMethods());
  }

  mapHandler(handler: Function, metadata: PlatformHandlerMetadata) {
    return async (koaContext: Koa.Context, next: Koa.Next) => {
      const {$ctx} = koaContext.request;

      $ctx.next = next;

      const error = await catchAsyncError(() => handler($ctx));

      if (error) {
        $ctx.error = error;
      }

      if (metadata.type !== PlatformHandlerType.RESPONSE_FN) {
        return $ctx.next && $ctx.error ? $ctx.next($ctx.error) : $ctx.next();
      }
    };
  }

  useContext(): this {
    const {app} = this;
    const invoke = createContext(this.injector);
    const platformExceptions = this.injector.get<PlatformExceptions>(PlatformExceptions);

    app.use((koaContext: Context, next: Next) => {
      const $ctx = invoke({
        request: koaContext.request as any,
        response: koaContext.response as any,
        koaContext
      });

      return runInContext($ctx, async () => {
        try {
          await $ctx.start();
          await next();
          const status = koaContext.status || 404;

          if (status === 404 && !$ctx.isDone()) {
            platformExceptions?.resourceNotFound($ctx);
          }
        } catch (error) {
          platformExceptions?.catch(error, $ctx);
        } finally {
          await $ctx.finish();
        }
      });
    });

    return this;
  }

  createApp() {
    const app = this.injector.settings.get("koa.app") || new Koa();
    koaQs(app, "extended");

    return {
      app,
      callback() {
        return app.callback();
      }
    };
  }

  multipart(options: PlatformMulterSettings): PlatformMulter {
    return getMulter(options);
  }

  statics(endpoint: string, options: PlatformStaticsOptions) {
    return staticsMiddleware(options);
  }

  bodyParser(type: "json" | "urlencoded" | "raw" | "text", additionalOptions: any = {}): any {
    const opts = this.injector.settings.get(`koa.bodyParser`);
    let parser: any = koaBodyParser;

    let options: Options = {};

    if (isFunction(opts)) {
      parser = opts;
      options = {};
    }

    return parser({...options, ...additionalOptions});
  }
}
