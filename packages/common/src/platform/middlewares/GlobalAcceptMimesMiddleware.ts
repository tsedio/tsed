import {Context} from "@tsed/platform-params";
import {IMiddleware, Middleware} from "../../mvc";

/**
 * @deprecated Since 2020-11-30. Use PlatformAcceptMimesMiddleware.
 * @ignore
 */
@Middleware()
export class GlobalAcceptMimesMiddleware implements IMiddleware {
  use(@Context() ctx: Context) {
    return;
  }
}
