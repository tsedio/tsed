import {isString} from "@tsed/core";
import {Injectable, InjectorService, ProviderScope} from "@tsed/di";
import {PlatformStaticsOptions} from "../../config";
import {PathParamsType, PlatformRouteStack} from "../../mvc/interfaces";

/**
 * Platform Router abstraction layer.
 * @platform
 */
@Injectable({
  scope: ProviderScope.INSTANCE
})
export class PlatformRouter {
  readonly stacks: PlatformRouteStack[] = [];

  /**
   * @deprecated
   * @param injector
   */
  static create(injector: InjectorService) {
    return injector.invoke<PlatformRouter>(PlatformRouter);
  }

  use(...handlers: any[]) {
    this.addRoute(this.mapUseOptions(handlers));

    return this;
  }

  addRoute(options: PlatformRouteStack) {
    this.stacks.push(options);

    return this;
  }

  all(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "all", path, handlers, isFinal: true});
  }

  get(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "get", path, handlers, isFinal: true});
  }

  post(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "post", path, handlers, isFinal: true});
  }

  put(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "put", path, handlers, isFinal: true});
  }

  delete(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "delete", path, handlers, isFinal: true});
  }

  patch(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "patch", path, handlers, isFinal: true});
  }

  head(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "head", path, handlers, isFinal: true});
  }

  options(path: PathParamsType, ...handlers: any[]) {
    return this.addRoute({method: "options", path, handlers, isFinal: true});
  }

  statics(path: string, options: PlatformStaticsOptions): this {
    this.stacks.push({
      method: "statics",
      path,
      options,
      handlers: []
    });
    return this;
  }

  public getStacks(): PlatformRouteStack[] {
    return this.stacks.reduce((stacks: PlatformRouteStack[], item: PlatformRouteStack) => {
      if (item.method === "router" && item.router) {
        const subStacks = item.router.getStacks().map((child) => {
          return {
            ...child,
            path: String(item.path || "") + String(child.path || "/")
          };
        });

        return [...stacks, ...subStacks];
      }

      return [...stacks, item];
    }, []);
  }

  private mapUseOptions(handlers: any[]): PlatformRouteStack {
    return handlers.reduce(
      (options: Record<string, any>, current: any, index) => {
        if (isString(current)) {
          return {
            ...options,
            path: current
          };
        }

        if (current instanceof PlatformRouter) {
          return {
            ...options,
            method: "router",
            router: current
          };
        }

        return {
          ...options,
          handlers: [...options.handlers, current]
        };
      },
      {
        method: "use",
        handlers: []
      }
    );
  }
}
