import {Unauthorized} from "ts-httpexceptions";
import {Middleware} from "../decorators/class/middleware";
import {EndpointInfo} from "../decorators/params/endpointInfo";
import {Req} from "../decorators/params/request";
import {IMiddleware} from "../interfaces";

/**
 * This middleware manage the authentication based on passport strategy.
 *
 * @middleware
 */
@Middleware()
export class AuthenticatedMiddleware implements IMiddleware {
  public use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {
    const options = endpoint.get(AuthenticatedMiddleware) || {};
    // @ts-ignore
    if (request.isAuthenticated && !request.isAuthenticated(options)) {
      throw new Unauthorized("Unauthorized");
    }
  }
}
