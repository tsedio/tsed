import type {InjectorService, PlatformContext, PlatformMulter, PlatformMulterSettings, PlatformStaticsOptions} from "@tsed/common";
import {
  createContext,
  PlatformAdapter,
  PlatformBuilder,
  PlatformExceptions,
  PlatformHandler,
  PlatformHandlerType,
  PlatformProvider,
  runInContext
} from "@tsed/common";
import type {Type} from "@tsed/core";
import {catchAsyncError, Env, isFunction} from "@tsed/core";
import type {PlatformHandlerMetadata, PlatformLayer} from "@tsed/platform-router";
import type {PlatformViews} from "@tsed/platform-views";
import type {OptionsJson, OptionsText, OptionsUrlencoded} from "body-parser";
import Express from "express";
import type {IncomingMessage, ServerResponse} from "http";
import type multer from "multer";
import {promisify} from "util";

import type {PlatformExpressStaticsOptions} from "../interfaces/PlatformExpressStaticsOptions.js";
import {staticsMiddleware} from "../middlewares/staticsMiddleware.js";
import {PlatformExpressHandler} from "../services/PlatformExpressHandler.js";

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
@PlatformProvider()
export class PlatformExpress extends PlatformAdapter<Express.Application> {
  static readonly NAME = "express";

  readonly providers = [
    {
      provide: PlatformHandler,
      useClass: PlatformExpressHandler
    }
  ];
  #multer: typeof multer;

  constructor(injector: InjectorService) {
    super(injector);

    import("multer").then(({default: multer}) => (this.#multer = multer));
  }

  /**
   * Create new serverless application. In this mode, the component scan are disabled.
   * @param module
   * @param settings
   */
  static create(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.create<Express.Application>(module, {
      ...settings,
      adapter: PlatformExpress
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
      adapter: PlatformExpress
    });
  }

  async beforeLoadRoutes() {
    const injector = this.injector;
    const {app} = this;

    // disable x-powered-by header
    injector.settings.get("env") === Env.PROD && app.getApp().disable("x-powered-by");

    await this.configureViewsEngine();
  }

  afterLoadRoutes() {
    const {app} = this;
    const platformExceptions = this.injector.get<PlatformExceptions>(PlatformExceptions)!;

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

    layers.forEach((layer) => {
      switch (layer.method) {
        case "statics":
          rawApp.use(layer.path, this.statics(layer.path as string, layer.opts as any));
          return;
      }

      rawApp[layer.method](...layer.getArgs());
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

  useContext(): this {
    const {app} = this;
    const invoke = createContext(this.injector);

    app.use(async (request: any, response: any, next: any) => {
      const $ctx = invoke({request, response});
      await $ctx.start();

      $ctx.response.getRes().on("finish", () => $ctx.finish());

      return runInContext($ctx, next);
    });

    return this;
  }

  createApp() {
    const app = this.injector.settings.get("express.app") || Express();

    return {
      app,
      callback: () => app
    };
  }

  multipart(options: PlatformMulterSettings): PlatformMulter {
    const m = this.#multer(options);
    const makePromise = (multer: any, name: string) => {
      // istanbul ignore next
      if (!multer[name]) return;

      const fn = multer[name];

      multer[name] = function apply(...args: any[]) {
        const middleware: any = Reflect.apply(fn, this, args);

        return (req: any, res: any) => promisify(middleware)(req, res);
      };
    };

    makePromise(m, "any");
    makePromise(m, "array");
    makePromise(m, "fields");
    makePromise(m, "none");
    makePromise(m, "single");

    return m;
  }

  statics(endpoint: string, options: PlatformStaticsOptions) {
    const {root, ...props} = options;

    return staticsMiddleware(root, props);
  }

  bodyParser(type: "json" | "text" | "urlencoded", additionalOptions: any = {}): any {
    const opts = this.injector.settings.get(`express.bodyParser.${type}`);

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
      const rawBody = this.injector.settings.get(`rawBody`);

      if (rawBody) {
        req.rawBody = buffer;
      }

      return true;
    };

    return parser({...options, ...additionalOptions});
  }

  private async configureViewsEngine() {
    const injector = this.injector;
    const {app} = this;

    try {
      const {exists, disabled} = this.injector.settings.get("views") || {};

      if (exists && !disabled) {
        const {PlatformViews} = await import("@tsed/platform-views");
        const platformViews = injector.get<PlatformViews>(PlatformViews)!;
        const express = app.getApp();

        platformViews.getEngines().forEach(({extension, engine}) => {
          express.engine(extension, engine.render);
        });

        platformViews.viewEngine && express.set("view engine", platformViews.viewEngine);
        platformViews.root && express.set("views", platformViews.root);
      }
    } catch (error) {
      // istanbul ignore next
      injector.logger.warn({
        event: "PLATFORM_VIEWS_ERROR",
        message: "Unable to configure the PlatformViews service on your environment.",
        error
      });
    }
  }
}
