import {
  createContext,
  InjectorService,
  PlatformAdapter,
  PlatformApplication,
  PlatformBuilder,
  PlatformContext,
  PlatformExceptions,
  PlatformHandlerType,
  PlatformMulter,
  PlatformMulterSettings,
  PlatformProvider,
  PlatformStaticsOptions,
  runInContext
} from "@tsed/common";
import {Env, isFunction, Type} from "@tsed/core";
import {PlatformHandlerMetadata, PlatformLayer} from "@tsed/platform-router";
import type {PlatformViews} from "@tsed/platform-views";
import {OptionsJson, OptionsText, OptionsUrlencoded} from "body-parser";
import Express from "express";
import {IncomingMessage, ServerResponse} from "http";
import {PlatformExpressStaticsOptions} from "../interfaces/PlatformExpressStaticsOptions";
import {multerMiddleware} from "../middlewares/multerMiddleware";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";

declare module "express" {
  export interface Request {
    id: string;
    $ctx: PlatformContext;
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
export class PlatformExpress implements PlatformAdapter<Express.Application> {
  static readonly NAME = "express";

  readonly providers = [];

  constructor(protected injector: InjectorService) {}

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
  static async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.bootstrap<Express.Application>(module, {
      ...settings,
      adapter: PlatformExpress
    });
  }

  async beforeLoadRoutes() {
    const injector = this.injector;
    const app = this.getPlatformApplication()!;

    // disable x-powered-by header
    injector.settings.get("env") === Env.PROD && app.getApp().disable("x-powered-by");

    await this.configureViewsEngine();
  }

  async afterLoadRoutes() {
    const app = this.getPlatformApplication()!;
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
  }

  mapLayers(layers: PlatformLayer[]) {
    const app = this.getPlatformApplication();
    const rawApp: any = app.getApp();

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
    switch (metadata.type) {
      case PlatformHandlerType.RAW_FN:
      case PlatformHandlerType.RAW_ERR_FN:
        return handler;
      case PlatformHandlerType.ERR_MIDDLEWARE:
        return async (error: unknown, req: any, res: any, next: any) => {
          return runInContext(req.$ctx, () => {
            const {$ctx} = req;

            $ctx.next = next;
            $ctx.error = error;

            return handler($ctx);
          });
        };
      default:
        return (req: any, res: any, next: any) => {
          return runInContext(req.$ctx, () => {
            req.$ctx.next = next;
            handler(req.$ctx);
          });
        };
    }
  }

  useContext(): this {
    const app = this.getPlatformApplication();
    const invoke = createContext(this.injector);

    this.injector.logger.debug("Mount app context");

    app.use(async (request: any, response: any, next: any) => {
      const $ctx = await invoke({request, response});
      await $ctx.start();

      $ctx.response.getRes().on("finish", () => $ctx.finish());

      return runInContext($ctx, next);
    });

    return this;
  }

  app() {
    const app = this.injector.settings.get("express.app") || Express();

    return {
      app,
      callback: () => app
    };
  }

  multipart(options: PlatformMulterSettings): PlatformMulter {
    return multerMiddleware(options);
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

  private getPlatformApplication() {
    return this.injector.get<PlatformApplication<Express.Application>>(PlatformApplication)!;
  }

  private async configureViewsEngine() {
    const injector = this.injector;
    const app = this.injector.get<PlatformApplication<Express.Application>>(PlatformApplication)!;

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
