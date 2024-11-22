import {isClass} from "@tsed/core";
import {constant, inject, injectable} from "@tsed/di";
import {ParamTypes} from "@tsed/platform-params";
import {AlterEndpointHandlersArg} from "@tsed/platform-router";
import {JsonEntityStore, JsonOperationRoute} from "@tsed/schema";

import {PlatformAcceptMimesMiddleware} from "../middlewares/PlatformAcceptMimesMiddleware.js";
import {PlatformMulterMiddleware} from "../middlewares/PlatformMulterMiddleware.js";
import {PlatformAdapter} from "./PlatformAdapter.js";

export class PlatformMiddlewaresChain {
  protected acceptMimes = constant<string[]>("acceptMimes", []);
  protected adapter = inject(PlatformAdapter);

  get(handlers: AlterEndpointHandlersArg, operationRoute: JsonOperationRoute): AlterEndpointHandlersArg {
    const {ACCEPT_MIMES, FILE} = this.getParamTypes(handlers, operationRoute);

    return {
      ...handlers,
      before: [ACCEPT_MIMES && PlatformAcceptMimesMiddleware, ...handlers.before, FILE && PlatformMulterMiddleware].filter(Boolean) as any[]
    };
  }

  protected hasAcceptMimes(operationRoute: JsonOperationRoute) {
    return operationRoute.endpoint.acceptMimes.length || this.acceptMimes.length;
  }

  protected getParamTypes(middlewares: AlterEndpointHandlersArg, operationRoute: JsonOperationRoute) {
    return middlewares.before
      .concat(middlewares.after)
      .filter(isClass)
      .reduce(
        (paramTypes, token) => {
          const entity = JsonEntityStore.fromMethod(token, "use");

          if (entity.decoratorType === "method") {
            const {FILE, RAW_BODY, BODY} = entity.getParamTypes();
            paramTypes.FILE = paramTypes.FILE || FILE;
            paramTypes.RAW_BODY = paramTypes.RAW_BODY || RAW_BODY;
            paramTypes.BODY = paramTypes.BODY || BODY;
          }

          return paramTypes;
        },
        {
          ACCEPT_MIMES: this.hasAcceptMimes(operationRoute),
          FILE: operationRoute.has(ParamTypes.FILES),
          RAW_BODY: operationRoute.has(ParamTypes.RAW_BODY),
          BODY: operationRoute.has(ParamTypes.BODY) || operationRoute.method === "ALL"
        }
      );
  }
}

injectable(PlatformMiddlewaresChain);
