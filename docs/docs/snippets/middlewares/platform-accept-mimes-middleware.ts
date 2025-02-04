import {uniq} from "@tsed/core";
import {Constant} from "@tsed/di";
import {NotAcceptable} from "@tsed/exceptions";
import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";
import {JsonOperationRoute} from "@tsed/schema";

/**
 * @middleware
 * @platform
 */
@Middleware({
  priority: -10
})
export class PlatformAcceptMimesMiddleware implements MiddlewareMethods {
  @Constant("acceptMimes", [])
  protected acceptMimes: string[];

  $alterEndpointHandlers(handlers: AlterEndpointHandlersArg, operationRoute: JsonOperationRoute) {
    const hasAcceptMimes = operationRoute.endpoint.acceptMimes.length || this.acceptMimes.length
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
