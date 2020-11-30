import {Middleware} from "../../mvc/decorators";
import {IMiddleware} from "../../mvc/interfaces";
import {Context} from "../../platform/decorators/context";

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
