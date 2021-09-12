import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

/**
 * @deprecated Since 2020-11-30. Use PlatformAcceptMimesMiddleware.
 * @ignore
 */
@Middleware()
export class GlobalAcceptMimesMiddleware implements MiddlewareMethods {
  use(@Context() ctx: Context) {
    return;
  }
}
