import {EndpointInfo, IMiddleware, Middleware, Req} from "@tsed/common";
import {Forbidden, Unauthorized} from "ts-httpexceptions";

@Middleware()
export class CustomAuthMiddleware implements IMiddleware {
  public use(@Req() request: Express.Request, @EndpointInfo() endpoint: EndpointInfo) {
    // retrieve options given to the @UseAuth decorator
    const options = endpoint.get(CustomAuthMiddleware) || {};

    if (!request.isAuthenticated()) { // passport.js method to check auth
      throw new Unauthorized("Unauthorized");
    }

    if (request.user.role !== options.role) {
      throw new Forbidden("Forbidden");
    }
  }
}
