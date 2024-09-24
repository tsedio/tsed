import {Req} from "@tsed/common";
import {Controller, ProviderScope, Scope} from "@tsed/di";
import {Authenticate} from "@tsed/passport";
import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";

@Controller("/auth")
@Scope(ProviderScope.SINGLETON)
export class AuthCtrl {
  @Post("/login")
  @Authenticate("login")
  login(@Req() req: Req, @BodyParams("email") email: string, @BodyParams("password") password: string) {
    // FACADE
    return req.user;
  }
}
