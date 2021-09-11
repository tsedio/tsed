import {Context} from "@tsed/platform-params";
import {Middleware} from "../../mvc/decorators";
import {IMiddleware} from "../../mvc/interfaces";

/**
 * @middleware
 * @deprecated Since 2020-11-30. Use PlatformAcceptMimesMiddleware.
 * @ignore
 */
@Middleware()
export class AcceptMimesMiddleware implements IMiddleware {
  public use(@Context() ctx: Context): void {
    return;
  }
}
