import Hapi from "@hapi/hapi";
import {Server} from "@hapi/hapi/lib/types/server/server";
import {
  createContext,
  InjectorService,
  PlatformAdapter,
  PlatformApplication,
  PlatformBuilder,
  PlatformHandler,
  PlatformMulter,
  PlatformMulterSettings,
  PlatformProvider,
  PlatformRequest,
  PlatformResponse,
  PlatformStaticsOptions,
  runInContext
} from "@tsed/common";
import {isFunction, Type} from "@tsed/core";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {PlatformHandlerMetadata, PlatformLayer} from "@tsed/platform-router";
import next from "ajv/dist/vocabularies/next";
import {staticsMiddleware} from "../middlewares/staticsMiddleware";
import {PlatformKoaHandler} from "../services/PlatformKoaHandler";
import {PlatformKoaRequest} from "../services/PlatformKoaRequest";
import {PlatformKoaResponse} from "../services/PlatformKoaResponse";
import {getMulter} from "../utils/multer";

declare global {
  namespace TsED {
    export interface Application {}
  }

  namespace TsED {
    export interface StaticsOptions {}
  }
}

/**
 * @platform
 * @koa
 */
@PlatformProvider()
export class PlatformHapi implements PlatformAdapter<Hapi.Server> {
  static readonly NAME = "hapi";

  readonly providers = [
    // {
    //   provide: PlatformResponse,
    //   useClass: PlatformKoaResponse
    // },
    // {
    //   provide: PlatformRequest,
    //   useClass: PlatformKoaRequest
    // },
    // {
    //   provide: PlatformHandler,
    //   useClass: PlatformKoaHandler
    // }
  ];

  constructor(private injector: InjectorService) {}

  /**
   * Create new serverless application. In this mode, the component scan are disabled.
   * @param module
   * @param settings
   */
  static create(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.create<Hapi.Server>(module, {
      ...settings,
      adapter: PlatformHapi
    });
  }

  /**
   * Bootstrap a server application
   * @param module
   * @param settings
   */
  static bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.bootstrap<Hapi.Server>(module, {
      ...settings,
      adapter: PlatformHapi
    });
  }

  onInit() {
    const app = this.getPlatformApplication();

    app.getApp().silent = true;
  }

  mapLayers(layers: PlatformLayer[]) {
    const {settings} = this.injector;
    const app = this.getPlatformApplication();
    const options = settings.get("hapi.options", {});
    const rawRouter = new Hapi.Server(options) as any;

    layers.forEach((layer) => {
      switch (layer.method) {
        case "statics":
          rawRouter.use(layer.path, this.statics(layer.path as string, layer.opts as any));
          break;

        default:
          rawRouter[layer.method](...layer.getArgs());
      }
    });

    app.getApp().use(rawRouter.routes()).use(rawRouter.allowedMethods());
  }

  mapHandler(handler: Function, metadata: PlatformHandlerMetadata) {
    if (metadata.isRawMiddleware()) {
      return handler;
    }

    return async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const {$ctx} = req;

      await handler($ctx);
    };
  }

  useContext(): this {
    const app = this.getPlatformApplication();
    const invoke = createContext(this.injector);
    const platformExceptions = this.injector.get<PlatformExceptions>(PlatformExceptions);

    this.injector.logger.debug("Mount app context");

    this.app().app.register();

    app.use((req: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const $ctx = invoke({
        request: req.raw.req,
        response: req.raw.res,
        req,
        h
      });

      // return runInContext($ctx, async () => {
      //   try {
      //     await $ctx.start();
      //     await next();
      //     const status = koaContext.status || 404;
      //
      //     if (status === 404 && !$ctx.isDone()) {
      //       platformExceptions?.resourceNotFound($ctx);
      //     }
      //   } catch (error) {
      //     platformExceptions?.catch(error, $ctx);
      //   } finally {
      //     await $ctx.finish();
      //   }
      // });
    });

    return this;
  }

  app() {
    const app: Hapi.Server = this.injector.settings.get("hapi.app") || new Hapi.Server();

    return {
      app,
      callback() {
        return app.listener;
      }
    };
  }

  // multipart(options: PlatformMulterSettings): PlatformMulter {
  //   return getMulter(options);
  // }
  //
  // statics(endpoint: string, options: PlatformStaticsOptions) {
  //   return staticsMiddleware(options);
  // }

  // bodyParser(type: "json" | "urlencoded" | "raw" | "text", additionalOptions: any = {}): any {
  //   const opts = this.injector.settings.get(`koa.bodyParser`);
  //   let parser: any = koaBodyParser;
  //
  //   let options: Options = {};
  //
  //   if (isFunction(opts)) {
  //     parser = opts;
  //     options = {};
  //   }
  //
  //   return parser({...options, ...additionalOptions});
  // }

  private getPlatformApplication() {
    return this.injector.get<PlatformApplication<Hapi.Server>>(PlatformApplication)!;
  }
}
