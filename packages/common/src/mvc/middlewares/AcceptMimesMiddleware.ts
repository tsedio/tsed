import {NotAcceptable} from "@tsed/exceptions";
import {Middleware, Req} from "../../mvc/decorators";
import {IMiddleware} from "../../mvc/interfaces";

/**
 * @middleware
 */
@Middleware()
export class AcceptMimesMiddleware implements IMiddleware {
  public use(@Req() request: Req): void {
    const mimes = request.ctx.endpoint.get(AcceptMimesMiddleware) || [];
    const find = mimes.find((mime: string) => request.accepts(mime));

    if (!find) {
      throw new NotAcceptable(mimes.join(", "));
    }
  }
}
