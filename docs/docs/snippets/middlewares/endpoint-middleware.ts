import {NotAcceptable} from "@tsed/exceptions";
import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

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
