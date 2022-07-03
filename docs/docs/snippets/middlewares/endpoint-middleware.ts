import {Context} from "@tsed/platform-params";
import {MiddlewareMethods, Middleware} from "@tsed/platform-middlewares";
import {NotAcceptable} from "@tsed/exceptions";

@Middleware()
export class AcceptMimesMiddleware implements MiddlewareMethods {
  use(@Context() $ctx: Context) {
    // get the parameters stored for the current endpoint or on the controller.
    const mimes = $ctx.endpoint.get(AcceptMimesMiddleware) || [];

    if (!$ctx.request.accepts(mimes)) {
      throw new NotAcceptable("Accepted mimes are: " + mimes);
    }
  }
}
