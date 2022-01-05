import {IncomingMessage, ServerResponse} from "http";
import {promisify} from "util";
import {Type} from "@tsed/core";
import {InjectorService, IProvider} from "@tsed/di";
import {createFakeRawDriver} from "./FakeRawDriver";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformMulter, PlatformMulterSettings} from "../config/interfaces/PlatformMulterSettings";
import {PlatformStaticsOptions} from "../config/interfaces/PlatformStaticsSettings";
import {HandlerMetadata} from "../domain/HandlerMetadata";
import {HandlerType} from "../interfaces/HandlerType";

export interface PlatformBuilderSettings<App = any, Router = any> extends Partial<TsED.Configuration> {
  adapter?: Type<PlatformAdapter<App, Router>>;
}

export class PlatformAdapter<App = TsED.Application, Router = TsED.Router> {
  /**
   * Load providers in top priority
   */
  readonly providers: IProvider[] = [];

  constructor(protected injector: InjectorService) {}

  get app() {
    return this.injector.get<PlatformApplication<App, Router>>(PlatformApplication)!;
  }

  /**
   * Called after the injector instantiation
   */
  onInit() {}

  /**
   * Create the framework app instance (Express/Koa)
   */
  createApp(): App {
    return createFakeRawDriver() as any;
  }

  /**
   * Return the callback which can be used to listen http/https/http2 server
   * @param rawApp
   */
  callback(rawApp: App): (req: IncomingMessage, res: ServerResponse) => any {
    return rawApp as any;
  }

  /**
   * Create a framework router instance (Express/Koa)
   */
  createRouter(options: Record<string, any>): Router {
    return createFakeRawDriver(options) as any;
  }

  /**
   * Bind the router to another router
   * @param router
   */
  bindRouter(router: Router): any {
    return router;
  }

  /**
   * Bind routers to app
   */
  useRouter(): this {
    return this;
  }

  async beforeLoadRoutes(): Promise<any> {}

  async afterLoadRoutes(): Promise<any> {}

  /**
   * Bind context to app
   */
  useContext(): this {
    return this;
  }

  createHandler(metadata: HandlerMetadata, compileHandler: () => (scope: Record<string, any>) => void) {
    switch (metadata.type) {
      case HandlerType.RAW_ERR_FN:
      case HandlerType.RAW_FN:
        return metadata.handler;
      case HandlerType.ERR_MIDDLEWARE:
        const errorHandler = compileHandler();

        return async (err: any, req: any, res: any, next: any) =>
          errorHandler({
            err,
            next,
            $ctx: req.$ctx
          });

      default:
        const handler = compileHandler();

        return async (request: any, response: any, next: any) => {
          return handler({
            next,
            $ctx: request.$ctx
          });
        };
    }
  }

  /**
   * Return the multer middleware adapter
   * @param options
   */
  multer(options: PlatformMulterSettings): PlatformMulter {
    const m = require("multer")(options);

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

  /**
   * Create statics middleware
   * @param path
   * @param options
   */
  statics(path: string, options: PlatformStaticsOptions): any {}
}
