import "@tsed/platform-multer/express";

import {IncomingMessage, ServerResponse} from "node:http";

import {catchAsyncError, Env, isFunction, Type} from "@tsed/core";
import {constant, inject, logger, runInContext} from "@tsed/di";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {
  adapter,
  application,
  createContext,
  PlatformAdapter,
  PlatformBuilder,
  PlatformContext,
  PlatformHandler,
  PlatformResponse,
  PlatformStaticsOptions
} from "@tsed/platform-http";
import {PlatformHandlerMetadata, PlatformHandlerType, PlatformLayer} from "@tsed/platform-router";
import {OptionsJson, OptionsText, OptionsUrlencoded} from "body-parser";
import Express from "express";
import {version} from "express/package.json" with {type: "json"};

import {PlatformExpressStaticsOptions} from "../interfaces/PlatformExpressStaticsOptions.js";
import {staticsMiddleware} from "../middlewares/staticsMiddleware.js";
import {PlatformExpressHandler} from "../services/PlatformExpressHandler.js";
import {PlatformExpressResponse} from "../services/PlatformExpressResponse.js";
import {convertPath} from "../utils/convertPath.js";

declare module "express" {
  export interface Request {
    id: string;
    $ctx: PlatformContext;
  }
}

function callNext(next: any, metadata: PlatformHandlerMetadata, $ctx: PlatformContext) {
  if (metadata.type !== PlatformHandlerType.RESPONSE_FN) {
    return next && $ctx.error && !$ctx.isDone() ? next($ctx.error) : next();
  }
}

declare global {
  namespace TsED {
    // export interface Router extends Express.Router {}

    export interface Application extends Express.Application {}

    export interface StaticsOptions extends PlatformExpressStaticsOptions {}

    export interface Request extends Express.Request {
      id: string;
      $ctx: PlatformContext;
    }
  }
}

/**
 * @platform
 * @express
 */
export class PlatformExpress extends PlatformAdapter<Express.Application> {
  readonly NAME = "express";

  /**
   * Create new serverless application. In this mode, the component scan are disabled.
   * @param module
   * @param settings
   */
  static create(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.create<Express.Application>(module, {
      ...settings,
      adapter: PlatformExpress as any
    });
  }

  /**
   * Bootstrap a server application
   * @param module
   * @param settings
   */
  static bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.bootstrap<Express.Application>(module, {
      ...settings,
      adapter: PlatformExpress as any
    });
  }

  async beforeLoadRoutes() {
    const {app} = this;

    // disable x-powered-by header
    constant<Env>("env") === Env.PROD && app.getApp().disable("x-powered-by");

    await this.configureViewsEngine();
  }

  afterLoadRoutes() {
    const {app} = this;
    const platformExceptions = inject(PlatformExceptions)!;

    // NOT FOUND
    app.use((req: any, res: any, next: any) => {
      const {$ctx} = req;
      !$ctx.isDone() && platformExceptions?.resourceNotFound(req.$ctx);
    });

    // EXCEPTION FILTERS
    app.use((err: any, req: any, res: any, next: any) => {
      const {$ctx} = req;
      !$ctx.isDone() && platformExceptions?.catch(err, $ctx);
    });

    return Promise.resolve();
  }

  mapLayers(layers: PlatformLayer[]) {
    const rawApp: any = this.app.getApp();
    const v = `v${version.split(".")[0]}`;

    layers.forEach((layer) => {
      const handlers = layer.getArgs(false);
      const {path, wildcard} = convertPath(layer.path, v as "v4" | "v5");

      layer.path = path;

      if (layer.method === "statics") {
        rawApp.use(path, this.statics(path, layer.opts as any));
        return;
      }

      if (wildcard) {
        handlers.unshift(((req: Express.Request, _: any, next: Express.NextFunction) => {
          if (req.params["0"] && !req.params[wildcard]) {
            req.params[wildcard] = req.params["0"];
          }

          next();
        }) as any);
      }

      rawApp[layer.method](path, ...handlers);
    });
  }

  mapHandler(handler: Function, metadata: PlatformHandlerMetadata) {
    if (metadata.type == PlatformHandlerType.ERR_MIDDLEWARE) {
      return (error: unknown, req: any, res: any, next: any) => {
        return runInContext(req.$ctx, async () => {
          const {$ctx} = req;

          $ctx.next = next;
          $ctx.error = error;

          $ctx.error = await catchAsyncError(() => handler($ctx));

          return callNext(next, metadata, $ctx);
        });
      };
    }

    return (req: any, res: any, next: any) => {
      return runInContext(req.$ctx, async () => {
        const {$ctx} = req;
        $ctx.next = next;

        $ctx.error = await catchAsyncError(() => handler($ctx));

        return callNext(next, metadata, $ctx);
      });
    };
  }

  useContext(): void {
    const invoke = createContext();
    const app = application();

    app.use(async (request: any, response: any, next: any) => {
      const $ctx = invoke({request, response});
      await $ctx.start();

      $ctx.response.getRes().on("finish", () => $ctx.finish());

      return runInContext($ctx, next);
    });
  }

  createApp() {
    const app = constant<Express.Express>("express.app") || Express();

    return {
      app,
      callback: () => app
    };
  }

  statics(endpoint: string | RegExp, options: PlatformStaticsOptions) {
    const {root, ...props} = options;

    return staticsMiddleware(root, props);
  }

  bodyParser(type: "json" | "text" | "urlencoded", additionalOptions: any = {}): any {
    const opts = constant(`express.bodyParser.${type}`);

    let parser: any = Express[type];
    let options: OptionsJson & OptionsText & OptionsUrlencoded = {};

    if (isFunction(opts)) {
      parser = opts;
      options = {};
    }

    if (type === "urlencoded") {
      options.extended = true;
    }

    options.verify = (req: IncomingMessage & {rawBody: Buffer}, _res: ServerResponse, buffer: Buffer) => {
      const rawBody = constant(`rawBody`);

      if (rawBody) {
        req.rawBody = buffer;
      }

      return true;
    };

    return parser({...options, ...additionalOptions});
  }

  private async configureViewsEngine() {
    const {app} = this;

    try {
      const {exists, disabled} = constant<{exists?: boolean; disabled?: boolean}>("views") || {};

      if (exists && !disabled) {
        const {PlatformViews} = await import("@tsed/platform-views");
        const platformViews = inject(PlatformViews)!;
        const express = app.getApp();

        platformViews.getEngines().forEach(({extension, engine}) => {
          express.engine(extension, engine.render);
        });

        platformViews.viewEngine && express.set("view engine", platformViews.viewEngine);
        platformViews.root && express.set("views", platformViews.root);
      }
    } catch (error) {
      // istanbul ignore next
      logger().warn({
        event: "PLATFORM_VIEWS_ERROR",
        message: "Unable to configure the PlatformViews service on your environment.",
        error
      });
    }
  }
}

adapter(PlatformExpress, [
  {
    token: PlatformHandler,
    useClass: PlatformExpressHandler
  },
  {
    token: PlatformResponse,
    useClass: PlatformExpressResponse
  }
]);
