import {uniq} from "@tsed/core";
import {constant, injectable, ProviderType} from "@tsed/di";
import {NotAcceptable} from "@tsed/exceptions";
import {MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";
import type {AlterEndpointHandlersArg} from "@tsed/platform-router";
import type {JsonOperationRoute} from "@tsed/schema";

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

  public use(@Context() ctx: Context): void {
    const {endpoint, request} = ctx;
    const mimes = uniq((endpoint?.get("acceptMimes") || []).concat(this.acceptMimes));

    if (mimes.length && !request.accepts(mimes)) {
      throw new NotAcceptable(mimes.join(", "));
    }
  }
}

injectable(PlatformAcceptMimesMiddleware).type(ProviderType.MIDDLEWARE).priority(-10);
