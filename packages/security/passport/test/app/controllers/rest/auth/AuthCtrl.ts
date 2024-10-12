import {Controller, ProviderScope, Scope} from "@tsed/di";
import {Req} from "@tsed/platform-http";
import {BodyParams} from "@tsed/platform-params";
import {Post, Returns} from "@tsed/schema";

import {Authenticate} from "../../../../../src/index.js";
import {Account} from "../../../models/Account.js";
import {Credentials} from "../../../models/Credentials.js";

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
