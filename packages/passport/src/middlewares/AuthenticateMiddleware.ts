import {EndpointInfo, Middleware, Req} from "@tsed/common";
import * as Passport from "passport";

@Middleware()
export class AuthenticateMiddleware {
  use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {
    const {protocol, options} = endpoint.store.get(AuthenticateMiddleware);

    return Passport.authenticate(protocol, options);
  }
}
