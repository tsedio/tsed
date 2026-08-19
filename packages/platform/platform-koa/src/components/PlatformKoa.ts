import "@tsed/platform-multer/koa";
import Koa, {Context, Next} from "koa";
import {
  adapter,
  application,
  createFetchContext,
  PlatformAdapter,
  PlatformBuilder,
  PlatformContext,
  PlatformHandler,
  PlatformRequest,
  PlatformStaticsOptions
} from "@tsed/platform-http";
import {PlatformHandlerMetadata, PlatformHandlerType, PlatformLayer} from "@tsed/platform-router";
import {catchAsyncError, isFunction, Type} from "@tsed/core";
import {constant, inject, runInContext} from "@tsed/di";
import koaBodyParser, {Options} from "koa-bodyparser";
import KoaRouter from "@koa/router";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {PlatformKoaHandler} from "../services/PlatformKoaHandler.js";
import {PlatformKoaRequest} from "../services/PlatformKoaRequest.js";
import {convertPath} from "../utils/convertPath.js";
// @ts-ignore
import koaQs from "koa-qs";
import send from "koa-send";
import {staticsMiddleware} from "../middlewares/staticsMiddleware.js";
import {writeFetchResponse} from "../utils/writeFetchResponse.js";
import {createFetchRequest} from "../utils/createFetchRequest.js";
import {createFetchRouteHandler} from "../utils/createFetchRouteHandler.js";

declare global {
  namespace TsED {
    export interface Application extends Koa {}
  }

  namespace TsED {
    export interface StaticsOptions extends send.SendOptions {}
  }
}

const koaRouterProto = KoaRouter.prototype as any;
koaRouterProto.$$match = koaRouterProto.match;
koaRouterProto.match = function match(...args: any[]) {
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
export class PlatformKoa extends PlatformAdapter<Koa> {
  readonly NAME = "koa";

  /**
   * Create new serverless application. In this mode, the component scan are disabled.
   * @param module
   * @param settings
   */
  static create(settings: Partial<TsED.Configuration>): PlatformBuilder<Koa>;
  static create(module: Type<any>, settings?: Partial<TsED.Configuration>): PlatformBuilder<Koa>;
  static create(module: Type<any> | Partial<TsED.Configuration>, settings?: Partial<TsED.Configuration>) {
    return new PlatformBuilder<Koa>({
      rootModule: settings ? (module as Type) : undefined,
      httpsPort: false,
      httpPort: false,
      ...(settings || (module as Partial<TsED.Configuration>)),
      adapter: PlatformKoa
    });
  }

  /**
   * Bootstrap a server application
   * @param module
   * @param settings
   */
  static bootstrap(settings: Partial<TsED.Configuration>): Promise<PlatformBuilder<Koa>>;
  static bootstrap(module: Type<any>, settings: Partial<TsED.Configuration>): Promise<PlatformBuilder<Koa>>;
  static bootstrap(module: Type<any> | Partial<TsED.Configuration>, settings?: Partial<TsED.Configuration>) {
    return new PlatformBuilder<Koa>({
      rootModule: settings ? (module as Type) : undefined,
      ...(settings || (module as Partial<TsED.Configuration>)),
      adapter: PlatformKoa
    }).bootstrap();
  }

  onInit() {
    this.app.getApp().silent = true;
  }

  mapLayers(layers: PlatformLayer[]) {
    const options = constant("koa.router", {});
    const rawRouter = new KoaRouter(options) as any;

    for (const layer of layers) {
      const {path, wildcard} = convertPath(layer.path);
      layer.path = path;

      if (layer.method === "statics") {
        rawRouter.use(path, this.statics(layer.path as string, layer.opts as any));
        continue;
      }

      const handlers = layer.getArgs(false);

      if (wildcard === "*") {
        handlers.unshift(((koaContext: any, next: any) => {
          koaContext.request.params["*"] = koaContext.request.params["0"];

          return next();
        }) as any);
      }

      if (!layer.handlers.some((metadata) => metadata.opts.native)) {
        rawRouter[layer.method](path, createFetchRouteHandler(layer.handlers));
        continue;
      }

      rawRouter[layer.method](path, ...handlers);
    }

    application().getApp().use(rawRouter.routes()).use(rawRouter.allowedMethods());
  }

  mapHandler(handler: Function, metadata: PlatformHandlerMetadata) {
    if (metadata.opts.native) {
      return handler;
    }

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

  async sendResponse($ctx: PlatformContext) {
    writeFetchResponse($ctx);
  }

  useContext(): void {
    const platformExceptions = inject(PlatformExceptions);

    application().use((koaContext: Context, next: Next) => {
      const $ctx = createFetchContext(createFetchRequest(koaContext), undefined, {
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
  }

  createApp() {
    const app = constant<Koa | undefined>("koa.app") || new Koa();
    koaQs(app, "extended");

    return {
      app,
      callback() {
        return app.callback();
      }
    };
  }

  statics(endpoint: string, options: PlatformStaticsOptions) {
    return staticsMiddleware(options);
  }

  bodyParser(_: "json" | "urlencoded" | "raw" | "text", additionalOptions: any = {}): any {
    const opts = constant(`koa.bodyParser`);
    let parser: any = koaBodyParser;

    let options: Options = {};

    if (isFunction(opts)) {
      parser = opts;
      options = {};
    }

    return parser({...options, ...additionalOptions});
  }
}

adapter(PlatformKoa, [
  {
    token: PlatformRequest,
    useClass: PlatformKoaRequest
  },
  {
    token: PlatformHandler,
    useClass: PlatformKoaHandler
  }
]);
