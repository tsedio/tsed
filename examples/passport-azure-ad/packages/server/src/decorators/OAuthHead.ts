import {UseBefore} from "@tsed/common";
import {OAuthBearerOptions} from "../protocols/BearerStrategy";

/**
 * Add headers and prevent HEAD request on route
 */
export function OAuthHead() {
  return UseBefore((request, response, next) => {
    const {scopes = []} = request.ctx.endpoint.get(OAuthBearerOptions) || {};
    response.set("Access-Control-Expose-Headers", "scopes");
    response.set("scopes", JSON.stringify(scopes));

    if (request.method.toUpperCase() === "HEAD") { // prevent head request and skip endpoint
      return response.send();
    }

    next();
  })
}
