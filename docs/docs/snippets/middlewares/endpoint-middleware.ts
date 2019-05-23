import {EndpointInfo, IMiddleware, Middleware, Req} from "@tsed/common";
import {NotAcceptable} from "ts-httpexceptions";

@Middleware()
export class AcceptMimesMiddleware implements IMiddleware {
  use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {

    // get the parameters stored for the current endpoint or on the controller.
    const mimes = endpoint.get(AcceptMimesMiddleware) || [];

    mimes.forEach((mime: string) => {
      if (!request.accepts(mime)) {
        throw new NotAcceptable(mime);
      }
    });
  }
}
