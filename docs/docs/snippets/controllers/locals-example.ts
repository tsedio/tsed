import {Controller} from "@tsed/di";
import {Middleware, UseBefore} from "@tsed/platform-middlewares";
import {Locals} from "@tsed/platform-params";
import {View} from "@tsed/platform-views";
import {Get} from "@tsed/schema";

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
