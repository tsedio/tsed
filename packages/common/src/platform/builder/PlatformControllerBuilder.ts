import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {JsonMethodPath, OperationMethods} from "@tsed/schema";
import {EndpointMetadata} from "../../mvc/models/EndpointMetadata";
import {ParamMetadata} from "../../mvc/models/ParamMetadata";
import {ParamTypes} from "../../mvc/models/ParamTypes";
import {ControllerProvider} from "../domain/ControllerProvider";
import {bindEndpointMiddleware} from "../middlewares/bindEndpointMiddleware";
import {PlatformAcceptMimesMiddleware} from "../middlewares/PlatformAcceptMimesMiddleware";
import {PlatformMulterMiddleware} from "../middlewares/PlatformMulterMiddleware";
import {useCtxHandler} from "../utils/useCtxHandler";

/**
 * @ignore
 */
function formatMethod(method: string | undefined): "get" | "post" | "put" | "patch" | "delete" | "head" | "options" | "all" | "use" {
  return (method === OperationMethods.CUSTOM ? "use" : method || "use").toLowerCase() as any;
}

/**
 * @ignore
 */
export class PlatformControllerBuilder {
  constructor(private provider: ControllerProvider) {}

  /**
   *
   * @returns {any}
   */
  public build(injector: InjectorService) {
    const {
      middlewares: {useBefore}
    } = this.provider;

    // Controller lifecycle
    this.buildMiddlewares(useBefore) // Controller before-middleware
      .buildEndpoints() // All endpoints and his middlewares
      .buildChildrenCtrls(injector); // Children controllers

    return this.provider.getRouter();
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
      operation?.operationPaths.forEach((operationPath) => {
        if (operationPath.method !== OperationMethods.CUSTOM) {
          const key = getKey(operationPath.method, operationPath.path);
          updateFinalRouteState(key);
          updateFinalRouteState(getKey(OperationMethods.ALL, operationPath.path));

          setFinalRoute(key, operationPath);
        }
      });
    });

    endpoints.forEach((endpoint) => {
      this.buildEndpoint(endpoint);
    });

    return this;
  }

  private buildEndpoint(endpoint: EndpointMetadata) {
    const {beforeMiddlewares, middlewares: mldwrs, afterMiddlewares, operation} = endpoint;
    const {
      middlewares: {use, useAfter}
    } = this.provider;

    const router = this.provider.getRouter();
    // Endpoint lifecycle
    let handlers: any[] = [];

    const hasFiles = [...endpoint.children.values()].find((item: ParamMetadata) => item.paramType === ParamTypes.FILES);

    handlers = handlers
      .concat(useCtxHandler(bindEndpointMiddleware(endpoint)))
      .concat(PlatformAcceptMimesMiddleware)
      .concat(hasFiles && PlatformMulterMiddleware)
      .concat(use) // Controller use-middlewares
      .concat(beforeMiddlewares) // Endpoint before-middlewares
      .concat(mldwrs) // Endpoint middlewares
      .concat(endpoint) // Endpoint metadata
      .concat(afterMiddlewares) // Endpoint after-middlewares
      .concat(useAfter) // Controller after middlewares (equivalent to afterEach)
      .filter((item: any) => !!item);

    // Add handlers to the router
    operation?.operationPaths.forEach(({path, method, isFinal}) => {
      router.addRoute({
        method: formatMethod(method),
        path,
        handlers,
        isFinal,
        endpoint,
        provider: this.provider
      });
    });

    if (!operation?.operationPaths.size) {
      router.use(...handlers);
    }
  }

  private buildChildrenCtrls(injector: InjectorService) {
    const {children} = this.provider;
    const router = this.provider.getRouter();

    children.forEach((child: Type<any>) => {
      const provider = injector.getProvider(child) as ControllerProvider;

      /* istanbul ignore next */
      if (!provider) {
        throw new Error("Controller component not found in the ControllerRegistry");
      }

      new PlatformControllerBuilder(provider).build(injector);

      router.use(provider.path, provider.getRouter());
    });
  }

  private buildMiddlewares(middlewares: any[]) {
    const router = this.provider.getRouter();

    middlewares
      .filter((o) => typeof o === "function")
      .forEach((middleware: any) => {
        router.use(middleware);
      });

    return this;
  }
}
