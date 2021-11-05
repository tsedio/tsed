import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {getOperationsRoutes, JsonOperationRoute, OperationMethods} from "@tsed/schema";
import {ControllerProvider} from "../domain/ControllerProvider";
import {PlatformRouterMethods} from "../interfaces/PlatformRouterMethods";
import {bindEndpointMiddleware} from "../middlewares/bindEndpointMiddleware";
import {PlatformAcceptMimesMiddleware} from "../middlewares/PlatformAcceptMimesMiddleware";
import {PlatformMulterMiddleware} from "../middlewares/PlatformMulterMiddleware";
import {PlatformRouter} from "../services/PlatformRouter";
import {useCtxHandler} from "../utils/useCtxHandler";
import {EndpointMetadata} from "../domain/EndpointMetadata";
import {ParamMetadata, ParamTypes} from "@tsed/platform-params";

/**
 * @ignore
 */
function formatMethod(method: string | undefined) {
  return (method === OperationMethods.CUSTOM ? "use" : method || "use").toLowerCase();
}

/**
 * @ignore
 */
export class PlatformControllerBuilder {
  constructor(private provider: ControllerProvider) {}

  /**
   * @returns {any}
   */
  public build(injector: InjectorService): PlatformRouterMethods {
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
    getOperationsRoutes<EndpointMetadata>(this.provider.token).forEach((operationRoute) => {
      this.buildEndpoint(operationRoute);
    });

    return this;
  }

  private buildEndpoint(operationRoute: JsonOperationRoute<EndpointMetadata>) {
    let handlers = this.getMiddlewares(operationRoute);

    const router = this.provider.getRouter<PlatformRouter>();
    router.addRoute({
      handlers,
      token: operationRoute.token,
      method: formatMethod(operationRoute.method),
      path: operationRoute.path,
      isFinal: operationRoute.isFinal
    });
  }

  private getMiddlewares(operationRoute: JsonOperationRoute<EndpointMetadata>) {
    const {endpoint} = operationRoute;
    const {beforeMiddlewares, middlewares: mldwrs, afterMiddlewares} = endpoint;

    const {
      middlewares: {use, useAfter}
    } = this.provider;

    const hasFiles = [...operationRoute.endpoint.children.values()].find((item: ParamMetadata) => item.paramType === ParamTypes.FILES);

    return (
      ([] as any[])
        .concat(useCtxHandler(bindEndpointMiddleware(endpoint)))
        .concat(PlatformAcceptMimesMiddleware)
        .concat(hasFiles && PlatformMulterMiddleware)
        .concat(beforeMiddlewares) // Endpoint before-middlewares
        .concat(use) // Controller use-middlewares
        // .concat(endpoint.cache && PlatformCacheMiddleware)
        .concat(mldwrs) // Endpoint middlewares
        .concat(endpoint) // Endpoint metadata
        .concat(afterMiddlewares) // Endpoint after-middlewares
        .concat(useAfter) // Controller after middlewares (equivalent to afterEach)
        .filter((item: any) => !!item)
    );
  }

  private buildChildrenCtrls(injector: InjectorService) {
    const {children} = this.provider;
    const router = this.provider.getRouter<PlatformRouter>();

    children.forEach((child: Type<any>) => {
      const provider = injector.getProvider(child) as ControllerProvider;

      /* istanbul ignore next */
      if (!provider) {
        throw new Error("Controller component not found in the ControllerRegistry");
      }

      new PlatformControllerBuilder(provider).build(injector);

      router.use(provider.path, provider.getRouter<PlatformRouter>());
    });
  }

  private buildMiddlewares(middlewares: any[]) {
    const router = this.provider.getRouter<PlatformRouter>();

    middlewares
      .filter((o) => typeof o === "function")
      .forEach((middleware: any) => {
        router.use(middleware);
      });

    return this;
  }
}
