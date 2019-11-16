import {Context, Controller, Get, Middleware, Req, UseBefore} from "@tsed/common";
import {Forbidden} from "ts-httpexceptions";

@Middleware()
class AuthTokenMiddleware {
  use(@Req() request: Express.Request, @Context() context: Context) {
    if (!context.has("auth")) {
      context.set("auth", new AuthToken(request));
    }

    try {
      context.get("auth").claims(); // check token
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
