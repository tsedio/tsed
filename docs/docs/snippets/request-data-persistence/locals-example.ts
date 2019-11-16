import {Controller, Get, Locals, Middleware, Render, UseBefore} from "@tsed/common";

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
  @Render("home.ejs") // will use locals and returned data to render the page
  get(@Locals("user") user: any) {
    console.log("user", user);

    return {
      description: "Hello world"
    };
  }
}
