import {ProviderType, constant, context, injectable} from "@tsed/di";
import type {AlterEndpointHandlersArg} from "@tsed/platform-router";
import type {JsonOperationRoute} from "@tsed/schema";
import type {MiddlewareMethods} from "@tsed/platform-middlewares";
import {NotAcceptable} from "@tsed/exceptions";
import {uniq} from "@tsed/core";

/**
 * @middleware
 * @platform
 */
export class PlatformAcceptMimesMiddleware implements MiddlewareMethods {
  protected acceptMimes = constant<string[]>("acceptMimes", []);

  public $alterEndpointHandlers(handlers: AlterEndpointHandlersArg, operationRoute: JsonOperationRoute) {
    const hasAcceptMimes = operationRoute.endpoint.acceptMimes.length || this.acceptMimes.length;
    return {
      ...handlers,
      before: [hasAcceptMimes && PlatformAcceptMimesMiddleware, ...handlers.before].filter(Boolean) as any[]
    };
  }

  public use(): void {
    const {endpoint, request} = context();
    const mimes = uniq((endpoint?.get("acceptMimes") || []).concat(this.acceptMimes));

    if (mimes.length && !request.accepts(mimes)) {
      throw new NotAcceptable(mimes.join(", "));
    }
  }
}

injectable(PlatformAcceptMimesMiddleware).type(ProviderType.MIDDLEWARE).priority(-10);
