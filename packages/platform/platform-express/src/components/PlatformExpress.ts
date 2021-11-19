import {
  createContext,
  PlatformApplication,
  PlatformBuilder,
  PlatformExceptions,
  PlatformHandler,
  PlatformRequest,
  PlatformResponse,
  PlatformRouter,
  PlatformViews
} from "@tsed/common";
import {Env, Type} from "@tsed/core";
import Express from "express";
import {rawBodyMiddleware} from "../middlewares/rawBodyMiddleware";
import {
  PlatformExpressApplication,
  PlatformExpressHandler,
  PlatformExpressRequest,
  PlatformExpressResponse,
  PlatformExpressRouter
} from "../services";

/**
 * @platform
 * @express
 */
export class PlatformExpress extends PlatformBuilder<Express.Application, Express.Router> {
  static providers = [
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

  static async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}): Promise<PlatformExpress> {
    return this.build<PlatformExpress>(PlatformExpress).bootstrap(module, settings);
  }

  protected useRouter(): this {
    this.logger.debug("Mount app router");
    this.app.getApp().use(rawBodyMiddleware);
    this.app.getApp().use(this.app.getRouter());

    return this;
  }

  protected useContext(): this {
    this.logger.debug("Mount app context");

    const invoke = createContext(this.injector);

    this.app.getApp().use(async (request: any, response: any, next: any) => {
      await invoke({request, response});

      return next();
    });

    return this;
  }

  protected async loadRoutes(): Promise<void> {
    // disable x-powered-by header
    this.injector.settings.get("env") === Env.PROD && this.app.getApp().disable("x-powered-by");

    this.configureViewsEngine();

    await super.loadRoutes();

    // NOT FOUND
    this.app.use((req: any, res: any, next: any) => {
      !res.headersSent && this.injector.get<PlatformExceptions>(PlatformExceptions)?.resourceNotFound(req.$ctx);
    });

    // EXCEPTION FILTERS
    this.app.use((err: any, req: any, res: any, next: any) => {
      !res.headersSent && this.injector.get<PlatformExceptions>(PlatformExceptions)?.catch(err, req.$ctx);
    });
  }

  private configureViewsEngine() {
    const platformViews = this.injector.get<PlatformViews>(PlatformViews)!;

    platformViews.getEngines().forEach(({extension, engine}) => {
      this.app.getApp().engine(extension, engine.render);
    });

    platformViews.viewEngine && this.app.getApp().set("view engine", platformViews.viewEngine);
    platformViews.root && this.app.getApp().set("views", platformViews.root);
  }
}
