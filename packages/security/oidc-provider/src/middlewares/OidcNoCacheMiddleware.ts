import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

@Middleware()
export class OidcNoCacheMiddleware implements MiddlewareMethods {
  use(@Context() ctx: Context) {
    ctx.response.setHeader("Pragma", "no-cache");
    ctx.response.setHeader("Cache-Control", "no-cache, no-store");
  }
}
