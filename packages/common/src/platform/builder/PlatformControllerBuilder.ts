import {PlatformHeadersMiddleware} from "../middlewares/PlatformHeadersMiddleware";
import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {JsonMethodPath, OperationMethods} from "@tsed/schema";
import {EndpointMetadata} from "../../mvc/models/EndpointMetadata";
import {ControllerProvider} from "../domain/ControllerProvider";
import {IPlatformDriver} from "../interfaces/IPlatformDriver";
import {bindEndpointMiddleware} from "../middlewares/bindEndpointMiddleware";
import {PlatformResponseMiddleware} from "../middlewares/PlatformResponseMiddleware";
import {PlatformRouter} from "../services/PlatformRouter";

function formatMethod(method: string | undefined) {
  return (method === OperationMethods.CUSTOM ? "use" : method || "use").toLowerCase();
}

export class PlatformControllerBuilder {
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
    const operationPaths: Map<string, JsonMethodPath> = new Map();
    const getKey = (method: string, path: any) => `${method}-${path}`;

    const updateFinalRouteState = (key: string) => {
      if (operationPaths.has(key)) {
        operationPaths.get(key)!.isFinal = false;
      }
    };

    const setFinalRoute = (key: string, operationPath: JsonMethodPath) => {
      operationPaths.set(key, operationPath);
      operationPath.isFinal = true;
    };

    endpoints.forEach(({operation}) => {
      operation?.operationPaths.forEach(operationPath => {
        if (operationPath.method !== OperationMethods.CUSTOM) {
          const key = getKey(operationPath.method, operationPath.path);
          updateFinalRouteState(key);
          updateFinalRouteState(getKey(OperationMethods.ALL, operationPath.path));

          setFinalRoute(key, operationPath);
        }
      });
    });

    endpoints.forEach(endpoint => {
      this.buildEndpoint(endpoint);
    });

    return this;
  }

  private buildEndpoint(endpoint: EndpointMetadata) {
    const {beforeMiddlewares, middlewares: mldwrs, afterMiddlewares, operation} = endpoint;
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
      .concat(PlatformHeadersMiddleware)
      .concat(afterMiddlewares) // Endpoint after-middlewares
      .filter((item: any) => !!item);

    // Add handlers to the router
    operation?.operationPaths.forEach(({path, method, isFinal}) => {
      const localHandlers = isFinal ? handlers.concat(PlatformResponseMiddleware) : handlers;
      router.addRoute({method: formatMethod(method), path, handlers: localHandlers});
    });

    if (!operation?.operationPaths.size) {
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

      new PlatformControllerBuilder(provider).build(injector);

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
