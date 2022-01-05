import {Inject, Injectable, InjectorService, PathType, ProviderScope} from "@tsed/di";
import {PlatformMulter, PlatformMulterSettings, PlatformStaticsOptions} from "../config";
import {PlatformRouteOptions, PlatformRouteWithoutHandlers} from "../interfaces";
import {PlatformHandler} from "./PlatformHandler";
import {PlatformAdapter} from "./PlatformAdapter";

/**
 * @ignore
 */
export const PLATFORM_ROUTER_OPTIONS = Symbol.for("PlatformRouterOptions");

declare global {
  namespace TsED {
    // @ts-ignore
    export interface Router extends Record<string, any> {}
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

  constructor(
    @Inject(PlatformAdapter) protected adapter: PlatformAdapter<App, Router>,
    @Inject(PlatformHandler) protected platformHandler: PlatformHandler,
    @Inject(PLATFORM_ROUTER_OPTIONS) routerOptions: Record<string, any>
  ) {
    this.rawRouter = this.raw = adapter.createRouter(routerOptions);
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

  statics(path: string, options: PlatformStaticsOptions): this {
    const mdlw = this.adapter.statics(path, options);

    mdlw && this.use(path, mdlw);
    return this;
  }

  multer(options: PlatformMulterSettings): PlatformMulter {
    return this.adapter.multer(options);
  }

  protected mapHandlers(handlers: any[], options: PlatformRouteWithoutHandlers = {}): any[] {
    return handlers.reduce((list, handler, index) => {
      if (typeof handler === "string") {
        return list.concat(handler);
      }

      if (handler instanceof PlatformRouter) {
        return list.concat(this.adapter.bindRouter(handler.rawRouter));
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
