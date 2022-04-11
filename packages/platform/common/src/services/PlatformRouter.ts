import {Inject, Injectable, InjectorService, PathType, ProviderScope} from "@tsed/di";
import {PlatformHandler} from "./PlatformHandler";
import {PlatformRouteOptions, PlatformRouteWithoutHandlers} from "../interfaces/PlatformRouteOptions";
import {PlatformStaticsOptions} from "../config/interfaces/PlatformStaticsSettings";
import {PlatformMulter, PlatformMulterSettings} from "../config/interfaces/PlatformMulterSettings";
import {PlatformAdapter} from "./PlatformAdapter";
import {RouterOptions} from "express";

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
export class PlatformRouter<App = TsED.Application, Router = TsED.Router> {
  rawRouter: Router;
  raw: any;
  isBuilt: boolean = false;

  @Inject()
  injector: InjectorService;

  callback: () => any;

  constructor(
    protected platformHandler: PlatformHandler,
    readonly adapter: PlatformAdapter<App, Router>,
    @Inject(PLATFORM_ROUTER_OPTIONS) routerOptions: Partial<RouterOptions> = {}
  ) {
    const {router, callback} = adapter.router(routerOptions);

    this.rawRouter = this.raw = router;
    this.callback = callback;
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

  statics(path: string, options: PlatformStaticsOptions) {
    return this.use(path, this.adapter.statics(path, options));
  }

  multer(options: PlatformMulterSettings): PlatformMulter {
    return this.adapter.multipart(options);
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
