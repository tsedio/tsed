import {Constant} from "@tsed/di";
import {NotAcceptable} from "@tsed/exceptions";
import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

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
