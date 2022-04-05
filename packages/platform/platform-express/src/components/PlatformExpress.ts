import type multer from "multer";
import Express, {RouterOptions} from "express";
import type {PlatformViews} from "@tsed/platform-views";
import {
  createContext,
  InjectorService,
  PlatformAdapter,
  PlatformApplication,
  PlatformBuilder,
  PlatformContext,
  PlatformExceptions,
  PlatformHandler,
  PlatformMulter,
  PlatformMulterSettings,
  PlatformRequest,
  PlatformResponse,
  PlatformStaticsOptions
} from "@tsed/common";
import {promisify} from "util";
import {Env, Type} from "@tsed/core";
import {rawBodyMiddleware} from "../middlewares/rawBodyMiddleware";
import {PlatformExpressHandler} from "../services/PlatformExpressHandler";
import {PlatformExpressResponse} from "../services/PlatformExpressResponse";
import {PlatformExpressRequest} from "../services/PlatformExpressRequest";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";
import {PlatformExpressStaticsOptions} from "../interfaces/PlatformExpressStaticsOptions";

declare module "express" {
  export interface Request {
    id: string;
    $ctx: PlatformContext;
  }
}

declare global {
  namespace TsED {
    export interface Router extends Express.Router {}

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
export class PlatformExpress implements PlatformAdapter<Express.Application, Express.Router> {
  readonly providers = [
    {
      provide: PlatformHandler,
      useClass: PlatformExpressHandler
    },
    {
      provide: PlatformResponse,
      useClass: PlatformExpressResponse
    },
    {
      provide: PlatformRequest,
      useClass: PlatformExpressRequest
    }
  ];
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
    return PlatformBuilder.create<Express.Application, Express.Router>(module, {
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
    return PlatformBuilder.bootstrap<Express.Application, Express.Router>(module, {
      ...settings,
      adapter: PlatformExpress
    });
  }

  useRouter(): this {
    const {logger} = this.injector;
    const app = this.injector.get<PlatformApplication<Express.Application>>(PlatformApplication)!;

    logger.debug("Mount app router");
    app.getApp().use(rawBodyMiddleware);
    app.getApp().use(app.getRouter());

    return this;
  }

  async beforeLoadRoutes() {
    const injector = this.injector;
    const app = this.injector.get<PlatformApplication<Express.Application>>(PlatformApplication)!;

    // disable x-powered-by header
    injector.settings.get("env") === Env.PROD && app.getApp().disable("x-powered-by");

    await this.configureViewsEngine();
  }

  async afterLoadRoutes() {
    const injector = this.injector;
    const app = this.injector.get<PlatformApplication<Express.Application>>(PlatformApplication)!;

    // NOT FOUND
    app.use((req: any, res: any, next: any) => {
      !res.headersSent && injector.get<PlatformExceptions>(PlatformExceptions)?.resourceNotFound(req.$ctx);
    });

    // EXCEPTION FILTERS
    app.use((err: any, req: any, res: any, next: any) => {
      !res.headersSent && injector.get<PlatformExceptions>(PlatformExceptions)?.catch(err, req.$ctx);
    });
  }

  useContext(): this {
    const {logger} = this.injector;

    logger.debug("Mount app context");

    const invoke = createContext(this.injector);
    const app = this.injector.get<PlatformApplication<Express.Application>>(PlatformApplication)!;

    app.getApp().use(async (request: any, response: any, next: any) => {
      await invoke({request, response});

      return next();
    });

    return this;
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

  app() {
    const app = this.injector.settings.get("express.app") || Express();
    return {
      app,
      callback() {
        return app;
      }
    };
  }

  router(routerOptions: Partial<RouterOptions> = {}) {
    const options = Object.assign(
      {
        mergeParams: true
      },
      this.injector.settings.express?.router || {},
      routerOptions
    );

    const router = Express.Router(options);

    return {
      router,
      callback() {
        return router;
      }
    };
  }

  statics(endpoint: string, options: PlatformStaticsOptions) {
    const {root, ...props} = options;

    return staticsMiddleware(root, props);
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
