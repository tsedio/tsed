import {Controller, Get} from "@tsed/common";
import {Req} from "@tsed/common/src/mvc/decorators/params/request";
import {Authenticate} from "@tsed/passport";

@Controller("/")
export class PassportFacebookCtrl {
  @Get("/auth/facebook")
  @Authenticate("facebook", {scope: "read_stream"})
  authenticated(@Req("user") user: Req) {
    // Facade
    return user;
  }

  @Get("/auth/facebook/callback")
  @Authenticate("facebook")
  callback(@Req("user") user: Req) {
    // Facade
    return user;
  }
}
