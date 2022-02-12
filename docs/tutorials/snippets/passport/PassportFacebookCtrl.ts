import {Req} from "@tsed/common";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {Authenticate} from "@tsed/passport";

@Controller("/auth")
export class AuthCtrl {
  @Get("/:provider")
  @Authenticate("facebook", {scope: ["email"]})
  authenticated(@Req("user") user: Req) {
    // Facade
    return user;
  }

  @Get("/:provider/callback")
  @Authenticate("facebook")
  callback(@Req("user") user: Req) {
    // Facade
    return user;
  }
}
