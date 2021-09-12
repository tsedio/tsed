import {Context, Middleware, MiddlewareMethods, Req} from "@tsed/common";
import {Forbidden, Unauthorized} from "@tsed/exceptions";

@Middleware()
export class CustomAuthMiddleware implements MiddlewareMethods {
  public use(@Req() request: Req, @Context() ctx: Context) {
    // retrieve options given to the @UseAuth decorator
    const options = ctx.endpoint.get(CustomAuthMiddleware) || {};

    if (!request.isAuthenticated()) { // passport.js method to check auth
      throw new Unauthorized("Unauthorized");
    }

    if (request.user?.role !== options.role) {
      throw new Forbidden("Forbidden");
    }
  }
}
