import {BodyParams, Controller, Post, ProviderScope, Req, Scope} from "@tsed/common";
import {Returns} from "@tsed/schema";

import {Authenticate} from "../../../../..";
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
