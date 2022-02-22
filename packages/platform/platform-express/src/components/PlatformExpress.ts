import Express from "express";
import type {PlatformViews} from "@tsed/platform-views";
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
import {Env, Type} from "@tsed/core";
import {rawBodyMiddleware} from "../middlewares/rawBodyMiddleware";
import {PlatformExpressApplication} from "../services/PlatformExpressApplication";
import {PlatformExpressRouter} from "../services/PlatformExpressRouter";
import {PlatformExpressHandler} from "../services/PlatformExpressHandler";
import {PlatformExpressResponse} from "../services/PlatformExpressResponse";
import {PlatformExpressRequest} from "../services/PlatformExpressRequest";

/**
 * @platform
 * @express
 */
export class PlatformExpress implements PlatformAdapter<Express.Application, Express.Router> {
  readonly providers = [
    {
      provide: PlatformApplication,
      useClass: PlatformExpressApplication
    },
    {
      provide: PlatformRouter,
      useClass: PlatformExpressRouter
    },
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

  constructor(private platform: PlatformBuilder<Express.Application, Express.Router>) {}

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
    const {logger, app} = this.platform;

    logger.debug("Mount app router");
    app.getApp().use(rawBodyMiddleware);
    app.getApp().use(app.getRouter());

    return this;
  }

  async beforeLoadRoutes() {
    const {injector, app} = this.platform;
    // disable x-powered-by header
    injector.settings.get("env") === Env.PROD && app.getApp().disable("x-powered-by");

    await this.configureViewsEngine();
  }

  async afterLoadRoutes() {
    const {injector, app} = this.platform;
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
    const {logger, app, injector} = this.platform;

    logger.debug("Mount app context");

    const invoke = createContext(injector);

    app.getApp().use(async (request: any, response: any, next: any) => {
      await invoke({request, response});

      return next();
    });

    return this;
  }

  private async configureViewsEngine() {
    const {settings, injector, app} = this.platform;
    try {
      const {exists, disabled} = settings.get("views") || {};

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
