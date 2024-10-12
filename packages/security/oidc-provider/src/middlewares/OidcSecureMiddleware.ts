import {BadRequest} from "@tsed/exceptions";
import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";
import url from "url";

@Middleware()
export class OidcSecureMiddleware implements MiddlewareMethods {
  use(@Context() ctx: Context) {
    const req = ctx.request;

    if (!req.secure) {
      if (req.method === "GET" || req.method === "HEAD") {
        ctx.response.redirect(
          302,
          url.format({
            protocol: "https",
            host: req.get("host"),
            pathname: req.url
          })
        );
      } else {
        throw new BadRequest("InvalidRequest", {
          error: "invalid_request",
          error_description: "Do yourself a favor and only use https"
        });
      }
    }
  }
}
