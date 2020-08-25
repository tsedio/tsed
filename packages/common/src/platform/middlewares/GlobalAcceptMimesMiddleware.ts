import {Configuration} from "@tsed/di";
import {NotAcceptable} from "@tsed/exceptions";
import {IMiddleware, Middleware} from "../../mvc";
import {Context} from "../decorators/context";

/**
 * @middleware
 */
@Middleware()
export class GlobalAcceptMimesMiddleware implements IMiddleware {
  constructor(@Configuration() private configuration: Configuration) {}

  use(@Context() ctx: Context) {
    const {request} = ctx;

    if (!request.accepts(this.configuration.acceptMimes)) {
      throw new NotAcceptable(this.configuration.acceptMimes.join(", "));
    }
  }
}
