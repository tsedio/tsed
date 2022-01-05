import Express from "express";
import type {PlatformViews} from "@tsed/platform-views";
import {
  createContext,
  PlatformAdapter,
  PlatformBuilder,
  PlatformExceptions,
  PlatformRequest,
  PlatformResponse,
  PlatformStaticsOptions
} from "@tsed/common";
import {Env, Type} from "@tsed/core";
import {rawBodyMiddleware} from "../middlewares/rawBodyMiddleware";
import {PlatformExpressRequest, PlatformExpressResponse} from "../services";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";
import {PlatformExpressStaticsOptions} from "../interfaces/PlatformExpressStaticsOptions";

declare global {
  namespace TsED {
    export interface Application extends Express.Application {}

    export interface StaticsOptions extends PlatformExpressStaticsOptions {}

    export interface Router extends Express.Router {}
  }
}

/**
 * @platform
 * @express
 */
export class PlatformExpress extends PlatformAdapter<Express.Application, Express.Router> {
  readonly providers = [
    {
      provide: PlatformResponse,
      useClass: PlatformExpressResponse
    },
    {
      provide: PlatformRequest,
      useClass: PlatformExpressRequest
    }
  ];

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

  createApp() {
    const app = this.injector.settings.get("express.app") || Express();
    app.callback = () => app;

    return app;
  }

  createRouter(options: Record<string, any>) {
    const routerOptions = this.injector.settings.get("express.router", {});
    options = Object.assign(
      {
        mergeParams: true
      },
      routerOptions,
      options
    );

    return Express.Router(options);
  }

  useRouter(): this {
    const {logger} = this.injector;

    logger.debug("Mount app router");
    this.app.getApp().use(rawBodyMiddleware);
    this.app.getApp().use(this.app.getRouter());

    return this;
  }

  statics(endpoint: string, options: PlatformStaticsOptions) {
    const {root, ...props} = options;

    return staticsMiddleware(root, props);
  }

  async beforeLoadRoutes() {
    // disable x-powered-by header
    this.injector.settings.get("env") === Env.PROD && this.app.getApp().disable("x-powered-by");

    await this.configureViewsEngine();
  }

  async afterLoadRoutes() {
    const {injector} = this;
    // NOT FOUND
    this.app.use((req: any, res: any, next: any) => {
      !res.headersSent && injector.get<PlatformExceptions>(PlatformExceptions)?.resourceNotFound(req.$ctx);
    });

    // EXCEPTION FILTERS
    this.app.use((err: any, req: any, res: any, next: any) => {
      !res.headersSent && injector.get<PlatformExceptions>(PlatformExceptions)?.catch(err, req.$ctx);
    });
  }

  useContext(): this {
    this.injector.logger.debug("Mount app context");

    const invoke = createContext(this.injector);

    this.app.getApp().use(async (request: any, response: any, next: any) => {
      await invoke({request, response});

      return next();
    });

    return this;
  }

  private async configureViewsEngine() {
    const {injector} = this;
    try {
      const {exists, disabled} = injector.settings.get("views") || {};

      if (exists && !disabled) {
        const {PlatformViews} = await import("@tsed/platform-views");
        const platformViews = injector.get<PlatformViews>(PlatformViews)!;
        const express = this.app.getApp();

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
