import {BodyParams, Controller, Post, ProviderScope, Req, Scope} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import {Returns} from "@tsed/schema";
import {Account} from "../../../models/Account";
import {Credentials} from "../../../models/Credentials";

@Controller("/auth")
@Scope(ProviderScope.SINGLETON)
export class AuthCtrl {
  @Post("/login")
  @Authenticate("login")
  @Returns(200, Account).ContentType("application/json")
  login(@Req("user") user: Account, @BodyParams() credentials: Credentials) {
    // FACADE
    return user;
  }
}
