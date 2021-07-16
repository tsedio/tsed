import {
  createContext,
  PlatformApplication,
  PlatformBuilder,
  PlatformExceptions,
  PlatformHandler,
  PlatformRequest,
  PlatformResponse,
  PlatformRouter,
  PlatformRouteStack,
  PlatformViews
} from "@tsed/common";
import {Env, Type} from "@tsed/core";
import Express from "express";
import {rawBodyMiddleware} from "../middlewares/rawBodyMiddleware";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";
import {PlatformExpressApplication, PlatformExpressHandler, PlatformExpressRequest, PlatformExpressResponse} from "../services";

/**
 * @platform
 * @express
 */
export class PlatformExpress extends PlatformBuilder<Express.Application> {
  static providers = [
    {
      provide: PlatformApplication,
      useClass: PlatformExpressApplication
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

  protected configure(): this {
    this.logger.info("Mount app context");

    this.app.getApp().use(async (req: any, res: any, next: any) => {
      await createContext(this.injector, this.createRequest(req), this.createResponse(res));

      return next();
    });

    this.app.use(rawBodyMiddleware);

    // disable x-powered-by header
    this.injector.settings.get("env") === Env.PROD && this.app.getApp().disable("x-powered-by");

    this.configureViewsEngine();

    return this;
  }

  protected async loadRoutes(): Promise<void> {
    await super.loadRoutes();

    // NOT FOUND
    this.app.getApp().use((req: any, res: any, next: any) => {
      !res.headersSent && this.injector.get<PlatformExceptions>(PlatformExceptions)?.resourceNotFound(req.$ctx);
    });

    // EXCEPTION FILTERS
    this.app.getApp().use((err: any, req: any, res: any, next: any) => {
      !res.headersSent && this.injector.get<PlatformExceptions>(PlatformExceptions)?.catch(err, req.$ctx);
    });
  }

  protected processStack(stack: PlatformRouteStack) {
    switch (stack.method) {
      case "statics":
        const {root, ...props} = stack.options;

        this.app.getRouter().use(stack.path, staticsMiddleware(root, props));
        break;

      default:
        super.processStack(stack);
        break;
    }

    return this;
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
