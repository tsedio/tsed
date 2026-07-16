import {Controller, ProviderScope, Scope} from "@tsed/di";
import {Post, Returns} from "@tsed/schema";
import {Account} from "../../../models/Account.js";
import {Authenticate} from "../../../../../src/index.js";
import {BodyParams} from "@tsed/platform-params";
import {Credentials} from "../../../models/Credentials.js";
import {Req} from "@tsed/platform-http";

@Controller("/auth")
@Scope(ProviderScope.SINGLETON)
export class AuthCtrl {
  @Post("/login")
  @Authenticate("login")
  @(Returns(200, Account).ContentType("application/json"))
  login(@Req("user") user: Account, @BodyParams() credentials: Credentials) {
    // FACADE
    return user;
  }
}
