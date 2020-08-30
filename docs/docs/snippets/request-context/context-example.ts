import {Context, Controller, Get, Middleware, UseBefore} from "@tsed/common";
import {Forbidden} from "@tsed/exceptions";
import {AuthToken} from "../domain/auth/AuthToken";

@Middleware()
class AuthTokenMiddleware {
  use(@Context() ctx: Context) {
    if (!ctx.has("auth")) {
      ctx.set("auth", new AuthToken(ctx.request));
    }

    try {
      ctx.get("auth").claims(); // check token
    } catch (er) {
      throw new Forbidden("Access forbidden - Bad token");
    }
  }
}

@Controller("/")
@UseBefore(AuthTokenMiddleware) // protect all routes for this controller
class MyCtrl {
  @Get("/")
  get(@Context() context: Context, @Context("auth") auth: AuthToken) {
    context.logger.info({event: "auth", auth}); // Attach log to the request
  }
}
