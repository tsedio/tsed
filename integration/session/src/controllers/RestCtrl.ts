import {BodyParams, Controller, Get, PathParams, Post, Session, Status} from "@tsed/common";

@Controller("/rest")
export class RestCtrl {

  @Get("/whoami")
  helloWorld(@Session() session: any) {
    console.log("User in session =>", session.user);

    return session.user && session.user.id ? `Hello user ${session.user.name}` : "Hello world";
  }

  @Post("/connect")
  @Status(204)
  connect(@BodyParams("name") name: string, @Session("user") user: any) {
    user.id = "1";
    user.name = "name";
  }

  @Post("/connect/:id")
  @Status(204)
  disconnect(@PathParams("id") id: string, @Session("user") user: any) {
    if (id === user.id) {
      user.id = null;
      delete user.name;
    }
  }
}
