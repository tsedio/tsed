import {Constant, Inject, Injectable} from "@tsed/di";
import {ParamTypes} from "@tsed/platform-params";
import {JsonEntityStore, JsonOperationRoute} from "@tsed/schema";
import {ControllerProvider} from "../domain/ControllerProvider";
import {bindEndpointMiddleware} from "../middlewares/bindEndpointMiddleware";
import {PlatformAcceptMimesMiddleware} from "../middlewares/PlatformAcceptMimesMiddleware";
import {PlatformMulterMiddleware} from "../middlewares/PlatformMulterMiddleware";
import {useCtxHandler} from "../utils/useCtxHandler";
import {PlatformAdapter} from "../services/PlatformAdapter";
import {isClass} from "@tsed/core";

@Injectable()
export class PlatformMiddlewaresChain {
  @Constant("acceptMimes", [])
  protected acceptMimes: string[];

  @Inject()
  protected adapter: PlatformAdapter;

  get(provider: ControllerProvider, operationRoute: JsonOperationRoute, parentMiddlewares: any[] = []) {
    const {endpoint} = operationRoute;
    const {beforeMiddlewares, middlewares: mldwrs, afterMiddlewares} = endpoint;

    const {
      middlewares: {useBefore, use, useAfter}
    } = provider;

    const allMiddlewares = [
      ...parentMiddlewares,
      ...useBefore,
      ...beforeMiddlewares,
      ...use,
      ...mldwrs,
      endpoint,
      ...afterMiddlewares,
      ...useAfter
    ];

    const {ACCEPT_MIMES, FILE, RAW_BODY, BODY} = this.getParamTypes(allMiddlewares, operationRoute);

    return [
      useCtxHandler(bindEndpointMiddleware(endpoint)),
      ACCEPT_MIMES && PlatformAcceptMimesMiddleware,
      FILE && PlatformMulterMiddleware,
      !FILE && RAW_BODY && this.adapter.bodyParser("raw"),
      !FILE && !RAW_BODY && BODY && this.adapter.bodyParser("json"),
      !FILE && !RAW_BODY && BODY && this.adapter.bodyParser("urlencoded"),
      ...allMiddlewares
    ].filter(Boolean);
  }

  protected hasAcceptMimes(operationRoute: JsonOperationRoute) {
    return operationRoute.endpoint.acceptMimes.length || this.acceptMimes.length;
  }

  protected getParamTypes(middlewares: any[], operationRoute: JsonOperationRoute) {
    return middlewares.filter(isClass).reduce(
      (paramTypes, token) => {
        if (token !== operationRoute.endpoint) {
          const entity = JsonEntityStore.fromMethod(token, "use");

          if (entity.decoratorType === "method") {
            const {FILE, RAW_BODY, BODY} = entity.getParamTypes();
            paramTypes.FILE = paramTypes.FILE || FILE;
            paramTypes.RAW_BODY = paramTypes.RAW_BODY || RAW_BODY;
            paramTypes.BODY = paramTypes.BODY || BODY;
          }
        }

        return paramTypes;
      },
      {
        ACCEPT_MIMES: this.hasAcceptMimes(operationRoute),
        FILE: operationRoute.has(ParamTypes.FILES),
        RAW_BODY: operationRoute.has(ParamTypes.RAW_BODY),
        BODY: operationRoute.has(ParamTypes.BODY)
      }
    );
  }
}
