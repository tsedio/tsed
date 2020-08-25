import {Controller, Get, Locals, Middleware, UseBefore, View} from "@tsed/common";

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
