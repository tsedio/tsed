import {Constant, Inject, Injectable} from "@tsed/di";
import {ParamTypes} from "@tsed/platform-params";
import {JsonOperationRoute} from "@tsed/schema";
import {ControllerProvider} from "../domain/ControllerProvider";
import {bindEndpointMiddleware} from "../middlewares/bindEndpointMiddleware";
import {PlatformAcceptMimesMiddleware} from "../middlewares/PlatformAcceptMimesMiddleware";
import {PlatformMulterMiddleware} from "../middlewares/PlatformMulterMiddleware";
import {useCtxHandler} from "../utils/useCtxHandler";
import {PlatformAdapter} from "../services/PlatformAdapter";

@Injectable()
export class PlatformMiddlewaresChain {
  @Constant("acceptMimes", [])
  protected acceptMimes: string[];

  @Inject()
  protected adapter: PlatformAdapter;

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
      operationRoute.has(ParamTypes.RAW_BODY) && this.adapter.bodyParser("raw"),
      operationRoute.has(ParamTypes.BODY) && this.adapter.bodyParser("json"),
      ...beforeMiddlewares,
      ...use,
      ...mldwrs,
      endpoint,
      ...afterMiddlewares,
      ...useAfter
    ].filter(Boolean);
  }

  protected hasAcceptMimes(operationRoute: JsonOperationRoute) {
    return operationRoute.endpoint.acceptMimes.length || this.acceptMimes.length;
  }
}
