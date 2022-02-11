import {Context} from "@tsed/platform-params";
import {Middleware, UseBefore} from "@tsed/platform-middlewares";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
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
