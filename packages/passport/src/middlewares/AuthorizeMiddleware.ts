import {EndpointInfo, Middleware, PathParams, Req} from "@tsed/common";
import * as Passport from "passport";
import {Unauthorized} from "ts-httpexceptions";

/**
 * @middleware
 */
@Middleware()
export class AuthorizeMiddleware {
  use(@Req() request: Req, @PathParams("protocol") protocolName: string, @EndpointInfo() endpoint: EndpointInfo) {
    const {protocol, options} = endpoint.store.get(AuthorizeMiddleware);

    if (protocol !== ":protocol") {
      if (protocol && protocol !== "*" && protocol !== protocolName) {
        throw new Unauthorized("Not authorized");
      }

      protocolName = protocol;
    }

    return Passport.authorize(protocolName, options);
  }
}
