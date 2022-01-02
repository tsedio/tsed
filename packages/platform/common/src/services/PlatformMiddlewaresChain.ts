import {Injectable} from "@tsed/di";
import {ParamTypes} from "@tsed/platform-params";
import {EndpointMetadata, JsonOperationRoute} from "@tsed/schema";
import {ControllerProvider} from "../domain/ControllerProvider";
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

    return [
      useCtxHandler(bindEndpointMiddleware(endpoint)),
      PlatformAcceptMimesMiddleware,
      this.uploadFile(operationRoute) && PlatformMulterMiddleware,
      ...beforeMiddlewares,
      ...use,
      ...mldwrs,
      endpoint,
      ...afterMiddlewares,
      ...useAfter
    ].filter((item: any) => !!item);
  }

  private uploadFile(operationRoute: JsonOperationRoute<EndpointMetadata>) {
    return [...operationRoute.endpoint.children.values()].find((item) => item.paramType === ParamTypes.FILES);
  }
}
