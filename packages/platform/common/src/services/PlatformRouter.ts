import {Inject, Injectable, InjectorService, PathType, ProviderScope} from "@tsed/di";
import {promisify} from "util";
import {PlatformMulter, PlatformMulterSettings, PlatformStaticsOptions} from "../config";
import {PlatformRouteOptions, PlatformRouteWithoutHandlers} from "../interfaces";
import {createFakeRawDriver} from "./FakeRawDriver";
import {PlatformHandler} from "./PlatformHandler";
import type multer from "multer";
/**
 * @ignore
 */
export const PLATFORM_ROUTER_OPTIONS = Symbol.for("PlatformRouterOptions");

declare global {
  namespace TsED {
    // @ts-ignore
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
  isBuilt: boolean = false;

  @Inject()
  injector: InjectorService;

  #multer: typeof multer;

  constructor(protected platformHandler: PlatformHandler) {
    this.rawRouter = this.raw = PlatformRouter.createRawRouter();
    import("multer").then(({default: multer}) => (this.#multer = multer));
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

  addRoute(options: Partial<PlatformRouteOptions>) {
    const {method, path, handlers, ...opts} = options;

    // @ts-ignore
    this.getRouter()[method](path, ...this.mapHandlers(handlers, {method, path, ...opts}));

    return this;
  }

  all(path: PathType, ...handlers: any[]) {
    return this.addRoute({method: "all", path, handlers, isFinal: true});
  }

  get(path: PathType, ...handlers: any[]) {
    return this.addRoute({method: "get", path, handlers, isFinal: true});
  }

  post(path: PathType, ...handlers: any[]) {
    return this.addRoute({method: "post", path, handlers, isFinal: true});
  }

  put(path: PathType, ...handlers: any[]) {
    return this.addRoute({method: "put", path, handlers, isFinal: true});
  }

  delete(path: PathType, ...handlers: any[]) {
    return this.addRoute({method: "delete", path, handlers, isFinal: true});
  }

  patch(path: PathType, ...handlers: any[]) {
    return this.addRoute({method: "patch", path, handlers, isFinal: true});
  }

  head(path: PathType, ...handlers: any[]) {
    return this.addRoute({method: "head", path, handlers, isFinal: true});
  }

  options(path: PathType, ...handlers: any[]) {
    return this.addRoute({method: "options", path, handlers, isFinal: true});
  }

  statics(path: string, options: PlatformStaticsOptions): this {
    return this;
  }

  multer(options: PlatformMulterSettings): PlatformMulter {
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

  protected mapHandlers(handlers: any[], options: PlatformRouteWithoutHandlers = {}): any[] {
    return handlers.reduce((list, handler, index) => {
      if (typeof handler === "string") {
        return list.concat(handler);
      }

      if (handler instanceof PlatformRouter) {
        return list.concat(handler.callback());
      }

      return list.concat(
        this.platformHandler.createHandler(handler, {
          ...options,
          isFinal: options.isFinal ? index === handlers.length - 1 : false
        })
      );
    }, []);
  }
}
