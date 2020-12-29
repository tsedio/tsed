import {
  IRoute,
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
export class PlatformExpress extends PlatformBuilder {
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

  protected async loadRoutes(routes: IRoute[]): Promise<void> {
    // disable x-powered-by header
    this.injector.settings.get("env") === Env.PROD && this.app.getApp().disable("x-powered-by");

    this.configureViewsEngine();

    await super.loadRoutes(routes);

    // NOT FOUND
    this.app.use((req: any, res: any) => {
      this.injector.get<PlatformExceptions>(PlatformExceptions)?.resourceNotFound(req.$ctx);
    });

    // EXCEPTION FILTERS
    this.app.use((err: any, req: any, res: any, next: any) => {
      this.injector.get<PlatformExceptions>(PlatformExceptions)?.catch(err, req.$ctx);
    });
  }

  private configureViewsEngine() {
    const platformViews = this.injector.get<PlatformViews>(PlatformViews)!;

    platformViews.getEngines().forEach(({extension, engine}) => {
      this.app.getApp().engine(extension, engine);
    });

    platformViews.viewEngine && this.app.getApp().set("view engine", platformViews.viewEngine);
    platformViews.root && this.app.getApp().set("views", platformViews.root);
  }
}
