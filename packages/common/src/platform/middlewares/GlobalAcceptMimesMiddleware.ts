import {IMiddleware, Middleware} from "../../mvc";
import {Context} from "../decorators/context";

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
