import {Context, Middleware, MiddlewareMethods} from "@tsed/common";

@Middleware()
export class OidcNoCacheMiddleware implements MiddlewareMethods {
  use(@Context() ctx: Context) {
    ctx.response.setHeader("Pragma", "no-cache");
    ctx.response.setHeader("Cache-Control", "no-cache, no-store");
  }
}
