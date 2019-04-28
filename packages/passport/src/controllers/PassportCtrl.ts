import {BodyParams, Controller, Get, Post, ProviderScope, Req, Scope} from "@tsed/common";
import {Authenticate} from "../decorators/authenticate";
import {Authorize} from "../decorators/authorize";

@Controller("/")
@Scope(ProviderScope.SINGLETON)
export class PassportCtrl {
  @Post("/login")
  @Authenticate("local")
  login(@Req() req: Req, @BodyParams("email") email: string, @BodyParams("password") password: string) {
    // FACADE
    return req.user;
  }

  @Post("/signup")
  @Authenticate("local")
  signup(@Req() req: Req, @BodyParams("email") email: string, @BodyParams("password") password: string) {
    // FACADE
    return req.user;
  }

  @Get("/userinfo")
  @Authenticate("local")
  getUserInfo() {}

  @Get("/logout")
  logout(@Req() req: Req) {
    req.logout();
  }

  @Get("/connect/:protocol")
  @Authorize(":protocol")
  connectProvider(@Req() req: Req) {
    // FACADE
    return req.user;
  }

  @Get("/connect/:protocol/callback")
  @Authorize(":protocol")
  connectProviderCallback(@Req() req: Req) {
    // FACADE
    return req.user;
  }
}
