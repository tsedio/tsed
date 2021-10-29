import {Locals} from "@tsed/platform-params";
import {Middleware, UseBefore} from "@tsed/platform-middlewares";
import {View} from "@tsed/platform-views";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Middleware()
class LocalsMiddleware {
  use(@Locals() locals: any) {
    // set some on locals
    locals.user = "user";
  }
}

@Controller("/")
@UseBefore(LocalsMiddleware)
class MyCtrl {
  @Get("/")
  @View("home.ejs") // will use locals and returned data to render the page
  get(@Locals("user") user: any) {
    console.log("user", user);

    return {
      description: "Hello world"
    };
  }
}
