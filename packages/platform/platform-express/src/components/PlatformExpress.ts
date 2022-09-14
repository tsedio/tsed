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
  PlatformStaticsOptions,
  runInContext
} from "@tsed/common";
import {Env, isFunction, nameOf, Type} from "@tsed/core";
import {PlatformHandlerMetadata, PlatformLayer} from "@tsed/platform-router";
import type {PlatformViews} from "@tsed/platform-views";
import {OptionsJson, OptionsText, OptionsUrlencoded} from "body-parser";
import Express from "express";
import {IncomingMessage, ServerResponse} from "http";
import type multer from "multer";
import {promisify} from "util";
import {PlatformExpressStaticsOptions} from "../interfaces/PlatformExpressStaticsOptions";
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
export class PlatformExpress implements PlatformAdapter<Express.Application> {
  readonly providers = [];
  #multer: typeof multer;

  constructor(protected injector: InjectorService) {
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
  static async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.bootstrap<Express.Application>(module, {
      ...settings,
      adapter: PlatformExpress
    });
  }

  onInit() {
    const middlewares = this.injector.settings.get("middlewares", []);

    this.injector.settings.set(
      "middlewares",
      middlewares.filter((middleware) => {
        const name = nameOf(middleware);
        if (["textParser", "jsonParser", "rawParser", "urlencodedParser"].includes(name)) {
          this.injector.settings.set(`express.bodyParser.${name.replace("Parser", "")}`, () => middleware);
          return false;
        }

        return true;
      })
    );
  }

  async beforeLoadRoutes() {
    const injector = this.injector;
    const app = this.injector.get<PlatformApplication<Express.Application>>(PlatformApplication)!;

    // disable x-powered-by header
    injector.settings.get("env") === Env.PROD && app.getApp().disable("x-powered-by");

    await this.configureViewsEngine();
  }

  async afterLoadRoutes() {
    const app = this.injector.get<PlatformApplication<Express.Application>>(PlatformApplication)!;
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
    const m = this.#multer(options);

    const makePromise = (multer: any, name: string) => {
      // istanbul ignore next
      if (!multer[name]) return;

      const fn = multer[name];

      multer[name] = function apply(...args: any[]) {
        const middleware = Reflect.apply(fn, this, args);

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

  bodyParser(type: "json" | "raw" | "text" | "urlencoded", additionalOptions: any = {}): any {
    const opts = this.injector.settings.get(`express.bodyParser.${type}`);
    let parser: any = Express[type];
    let options: OptionsJson & OptionsText & OptionsUrlencoded = {};

    if (isFunction(opts)) {
      parser = opts;
      options = {};
    }

    switch (type) {
      case "urlencoded":
        options.extended = true;
        break;
      case "raw":
        options.type = () => true;
        break;
    }

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
