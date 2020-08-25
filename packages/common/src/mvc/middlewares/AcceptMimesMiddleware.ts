import {NotAcceptable} from "@tsed/exceptions";
import {Middleware} from "../../mvc/decorators";
import {IMiddleware} from "../../mvc/interfaces";
import {Context} from "../../platform/decorators/context";

/**
 * @middleware
 */
@Middleware()
export class AcceptMimesMiddleware implements IMiddleware {
  public use(@Context() ctx: Context): void {
    const {endpoint, request} = ctx;
    const mimes = endpoint.get(AcceptMimesMiddleware) || [];

    if (!request.accepts(mimes)) {
      throw new NotAcceptable(mimes.join(", "));
    }
  }
}
