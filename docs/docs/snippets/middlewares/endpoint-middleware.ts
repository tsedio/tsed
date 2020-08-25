import {EndpointInfo, IMiddleware, Middleware, Req} from "@tsed/common";
import {NotAcceptable} from "@tsed/exceptions";

@Middleware()
export class AcceptMimesMiddleware implements IMiddleware {
  use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {
    // get the parameters stored for the current endpoint or on the controller.
    const mimes = endpoint.get(AcceptMimesMiddleware) || [];

    if (!request.accepts(mimes)) {
      throw new NotAcceptable("Accepted mimes are: " + mimes);
    }
  }
}
