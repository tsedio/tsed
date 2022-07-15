import {Context} from "@tsed/platform-params";
import {Constant} from "@tsed/di";
import {MiddlewareMethods, Middleware} from "@tsed/platform-middlewares";
import {NotAcceptable} from "@tsed/exceptions";

@Middleware()
export default class AcceptMimesMiddleware implements MiddlewareMethods {
  @Constant("acceptMimes")
  acceptMimes: string[];

  use(@Context() $ctx: Context) {
    if (!$ctx.request.accepts(this.acceptMimes)) {
      throw new NotAcceptable("Accepted mimes are: " + this.acceptMimes.join(", "));
    }
  }
}
