import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {IPathMethod} from "../../mvc/interfaces/IPathMethod";
import {EndpointMetadata} from "../../mvc/models/EndpointMetadata";
import {ControllerProvider} from "../../platform/domain/ControllerProvider";
import {IPlatformDriver} from "../interfaces/IPlatformDriver";
import {bindEndpointMiddleware} from "../middlewares/bindEndpointMiddleware";
import {SendResponseMiddleware} from "../middlewares/SendResponseMiddleware";
import {statusAndHeadersMiddleware} from "../middlewares/statusAndHeadersMiddleware";
import {PlatformRouter} from "../services/PlatformRouter";

export class ControllerBuilder {
  constructor(private provider: ControllerProvider) {}

  /**
   *
   * @returns {any}
   */
  public build(injector: InjectorService): IPlatformDriver {
    const {
      routerOptions,
      middlewares: {useBefore, useAfter}
    } = this.provider;

    this.provider.router = PlatformRouter.create(injector, routerOptions);
    // Controller lifecycle
    this.buildMiddlewares(useBefore) // Controller before-middleware
      .buildEndpoints() // All endpoints and his middlewares
      .buildMiddlewares(useAfter) // Controller after-middleware
      .buildChildrenCtrls(injector); // Children controllers

    return this.provider.router;
  }

  private buildEndpoints() {
    const {endpoints} = this.provider;
    const pathsMethodsMap: Map<string, IPathMethod> = new Map();
    const getKey = (method: string, path: any) => `${method}-${path}`;

    const updateFinalRouteState = (key: string) => {
      if (pathsMethodsMap.has(key)) {
        pathsMethodsMap.get(key)!.isFinal = false;
      }
    };

    const setFinalRoute = (key: string, pathMethod: IPathMethod) => {
      pathsMethodsMap.set(key, pathMethod);
      pathMethod.isFinal = true;
    };
    endpoints.forEach(({pathsMethods}) => {
      pathsMethods.forEach(pathMethod => {
        pathMethod.method = pathMethod.method || "use";

        if (pathMethod.method !== "use") {
          const key = getKey(pathMethod.method, pathMethod.path);
          updateFinalRouteState(key);
          updateFinalRouteState(getKey("all", pathMethod.path));

          setFinalRoute(key, pathMethod);
        }
      });
    });

    endpoints.forEach(endpoint => {
      this.buildEndpoint(endpoint);
    });

    return this;
  }

  private buildEndpoint(endpoint: EndpointMetadata) {
    const {beforeMiddlewares, middlewares: mldwrs, afterMiddlewares, pathsMethods} = endpoint;
    const {
      router,
      middlewares: {use}
    } = this.provider;
    // Endpoint lifecycle
    let handlers: any[] = [];

    handlers = handlers
      .concat(bindEndpointMiddleware(endpoint))
      .concat(use) // Controller use-middlewares
      .concat(beforeMiddlewares) // Endpoint before-middlewares
      .concat(mldwrs) // Endpoint middlewares
      .concat(endpoint) // Endpoint metadata
      .concat(statusAndHeadersMiddleware)
      .concat(afterMiddlewares) // Endpoint after-middlewares
      .filter((item: any) => !!item);

    // Add handlers to the router
    pathsMethods.forEach(({path, method, isFinal}) => {
      const localHandlers = isFinal ? handlers.concat(SendResponseMiddleware) : handlers;

      router.addRoute({method: method!, path, handlers: localHandlers});
    });

    if (!pathsMethods.length) {
      router.use(...handlers);
    }
  }

  private buildChildrenCtrls(injector: InjectorService) {
    const {children, router} = this.provider;

    children.forEach((child: Type<any>) => {
      const provider = injector.getProvider(child) as ControllerProvider;

      /* istanbul ignore next */
      if (!provider) {
        throw new Error("Controller component not found in the ControllerRegistry");
      }

      new ControllerBuilder(provider).build(injector);

      router.use(provider.path, provider.router);
    });
  }

  private buildMiddlewares(middlewares: any[]) {
    const {router} = this.provider;

    middlewares
      .filter(o => typeof o === "function")
      .forEach((middleware: any) => {
        router.use(middleware);
      });

    return this;
  }
}
