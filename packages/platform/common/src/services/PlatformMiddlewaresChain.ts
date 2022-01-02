import {Constant, Injectable} from "@tsed/di";
import {ParamTypes} from "@tsed/platform-params";
import {JsonMethodStore, JsonOperationRoute} from "@tsed/schema";
import {ControllerProvider} from "../domain/ControllerProvider";
import {bindEndpointMiddleware} from "../middlewares/bindEndpointMiddleware";
import {PlatformAcceptMimesMiddleware} from "../middlewares/PlatformAcceptMimesMiddleware";
import {PlatformMulterMiddleware} from "../middlewares/PlatformMulterMiddleware";
import {useCtxHandler} from "../utils/useCtxHandler";

@Injectable()
export class PlatformMiddlewaresChain {
  @Constant("acceptMimes", [])
  protected acceptMimes: string[];

  get(provider: ControllerProvider, operationRoute: JsonOperationRoute) {
    const {endpoint} = operationRoute;
    const {beforeMiddlewares, middlewares: mldwrs, afterMiddlewares} = endpoint;

    const {
      middlewares: {use, useAfter}
    } = provider;

    return [
      useCtxHandler(bindEndpointMiddleware(endpoint)),
      this.hasAcceptMimes(operationRoute) && PlatformAcceptMimesMiddleware,
      operationRoute.has(ParamTypes.FILES) && PlatformMulterMiddleware,
      ...beforeMiddlewares,
      ...use,
      ...mldwrs,
      endpoint,
      ...afterMiddlewares,
      ...useAfter
    ].filter((item: any) => !!item);
  }

  protected hasAcceptMimes(operationRoute: JsonOperationRoute) {
    return operationRoute.endpoint.acceptMimes.length || this.acceptMimes.length;
  }
}
