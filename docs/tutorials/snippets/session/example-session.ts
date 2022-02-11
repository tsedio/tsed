import {Session, BodyParams} from "@tsed/platform-params";
import {Get, Post} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {Returns} from "@tsed/schema";

@Controller("/")
export class MyCtrl {
  @Get("/whoami")
  whoAmI(@Session() session: any) {
    console.log("User in session =>", session.user);

    return session.user && session.user.id ? `Hello user ${session.user.name}` : "Hello world";
  }

  @Post("/login")
  @Returns(204)
  login(@BodyParams("name") name: string, @Session("user") user: any) {
    user.id = "1";
    user.name = name;
  }

  @Post("/logout")
  @Returns(204)
  logout(@Session("user") user: any) {
    user.id = null;
    delete user.name;
  }
}
