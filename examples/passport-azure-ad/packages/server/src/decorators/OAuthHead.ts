import {Context, UseBefore} from "@tsed/common";
import {OAuthBearerOptions} from "../protocols/BearerStrategy";

export class OAuthHeadMiddleware {
  use(@Context() ctx: Context) {
    const {response, request, endpoint} = ctx;
    const {scopes = []} = endpoint.get(OAuthBearerOptions) || {};

    response.setHeaders({
      "Access-Control-Expose-Headers": "scopes",
      "scopes": JSON.stringify(scopes)
    });

    if (request.method.toUpperCase() === "HEAD") { // prevent head request and skip endpoint
      return response.body(undefined);
    }
  }
}

/**
 * Add headers and prevent HEAD request on route
 */
export function OAuthHead() {
  return UseBefore(OAuthHeadMiddleware);
}
