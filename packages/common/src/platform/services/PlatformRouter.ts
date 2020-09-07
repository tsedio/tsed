import {Inject, Injectable, InjectorService, ProviderScope} from "@tsed/di";
import {promisify} from "util";
import {PlatformMulter, PlatformMulterSettings, PlatformStaticsOptions} from "../../config";
import {PathParamsType} from "../../mvc/interfaces/PathParamsType";
import {PlatformRouteOptions} from "../interfaces/PlatformRouterMethods";
import {createFakeRawDriver} from "./FakeRawDriver";
import {PlatformHandler} from "./PlatformHandler";

export const PLATFORM_ROUTER_OPTIONS = Symbol.for("PlatformRouterOptions");

declare global {
  namespace TsED {
    export interface Router {}
  }
}

/**
 * Platform Router abstraction layer.
 * @platform
 */
@Injectable({
  scope: ProviderScope.INSTANCE
})
export class PlatformRouter<Router = TsED.Router> {
  rawRouter: Router;
  raw: any;

  @Inject()
  injector: InjectorService;

  constructor(protected platformHandler: PlatformHandler) {
    this.rawRouter = this.raw = PlatformRouter.createRawRouter();
  }

  /**
   * Create a new instance of PlatformRouter
   * @param injector
   * @param routerOptions
   */
  static create(injector: InjectorService, routerOptions: any = {}) {
    const locals = new Map();
    locals.set(PLATFORM_ROUTER_OPTIONS, routerOptions);

    return injector.invoke<PlatformRouter>(PlatformRouter, locals);
  }

  protected static createRawRouter(): any {
    return createFakeRawDriver();
  }

  callback(): any {
    return this.raw;
  }

  getRouter(): Router {
    return this.rawRouter;
  }

  use(...handlers: any[]) {
    // @ts-ignore
    this.getRouter().use(...this.mapHandlers(handlers));

    return this;
  }

  addRoute({method, path, handlers}: PlatformRouteOptions) {
    // @ts-ignore
    this.getRouter()[method](path, ...this.mapHandlers(handlers));

    return this;
  }

  all(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "all", path, handlers});
  }

  get(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "get", path, handlers});
  }

  post(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "post", path, handlers});
  }

  put(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "put", path, handlers});
  }

  delete(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "delete", path, handlers});
  }

  patch(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "patch", path, handlers});
  }

  head(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "head", path, handlers});
  }

  options(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "options", path, handlers});
  }

  statics(path: string, options: PlatformStaticsOptions) {
    console.warn("Statics methods aren't implemented on this platform");
  }

  multer(options: PlatformMulterSettings): PlatformMulter {
    const m = require("multer")(options);

    const makePromise = (multer: any, name: string) => {
      // istanbul ignore next
      if (!multer[name]) return;

      const fn = multer[name];

      multer[name] = function apply() {
        const middleware = Reflect.apply(fn, this, arguments);

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

  mapHandlers(handlers: any[]): any[] {
    return handlers.map((handler) => {
      if (typeof handler === "string") {
        return handler;
      }

      if (handler instanceof PlatformRouter) {
        return handler.callback();
      }

      return this.platformHandler.createHandler(handler);
    });
  }
}
