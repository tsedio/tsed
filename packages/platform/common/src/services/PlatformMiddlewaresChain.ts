import {Injectable} from "@tsed/di";
import {ParamMetadata, ParamTypes} from "@tsed/platform-params";
import {JsonOperationRoute} from "@tsed/schema";
import {ControllerProvider} from "../domain/ControllerProvider";
import {EndpointMetadata} from "../domain/EndpointMetadata";
import {bindEndpointMiddleware} from "../middlewares/bindEndpointMiddleware";
import {PlatformAcceptMimesMiddleware} from "../middlewares/PlatformAcceptMimesMiddleware";
import {PlatformMulterMiddleware} from "../middlewares/PlatformMulterMiddleware";
import {useCtxHandler} from "../utils/useCtxHandler";

@Injectable()
export class PlatformMiddlewaresChain {
  get(provider: ControllerProvider, operationRoute: JsonOperationRoute<EndpointMetadata>) {
    const {endpoint} = operationRoute;
    const {beforeMiddlewares, middlewares: mldwrs, afterMiddlewares} = endpoint;

    const {
      middlewares: {use, useAfter}
    } = provider;

    const hasFiles = [...operationRoute.endpoint.children.values()].find((item: ParamMetadata) => item.paramType === ParamTypes.FILES);

    return ([] as any[])
      .concat(useCtxHandler(bindEndpointMiddleware(endpoint)))
      .concat(PlatformAcceptMimesMiddleware)
      .concat(hasFiles && PlatformMulterMiddleware)
      .concat(beforeMiddlewares) // Endpoint before-middlewares
      .concat(use) // Controller use-middlewares
      .concat(mldwrs) // Endpoint middlewares
      .concat(endpoint) // Endpoint metadata
      .concat(afterMiddlewares) // Endpoint after-middlewares
      .concat(useAfter) // Controller after middlewares (equivalent to afterEach)
      .filter((item: any) => !!item);
  }
}
