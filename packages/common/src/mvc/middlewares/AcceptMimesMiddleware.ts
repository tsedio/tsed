import {Context} from "@tsed/platform-params";
import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";

/**
 * @middleware
 * @deprecated Since 2020-11-30. Use PlatformAcceptMimesMiddleware.
 * @ignore
 */
@Middleware()
export class AcceptMimesMiddleware implements MiddlewareMethods {
  public use(@Context() ctx: Context): void {
    return;
  }
}
