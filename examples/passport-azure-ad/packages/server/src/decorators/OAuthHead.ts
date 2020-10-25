import {Context, UseBefore} from "@tsed/common";
import {PassportMiddleware} from "@tsed/passport";

export class OAuthHeadMiddleware {
  use(@Context() ctx: Context) {
    const {response, request, endpoint} = ctx;
    const {options: {scopes = []}} = endpoint.get(PassportMiddleware) || {};

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
