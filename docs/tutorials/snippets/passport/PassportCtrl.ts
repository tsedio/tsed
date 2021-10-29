import {Req} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";
import {Controller, ProviderScope, Scope} from "@tsed/di";

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
