import {BodyParams, PathParams} from "@tsed/platform-params";
import {Get, Groups, Post, Returns} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {User} from "../models/User";

@Controller("/")
export class UsersCtrl {
  @Get("/:id")
  @Returns(200, User).Groups("group.*")
  async get(@PathParams("id") id: string) {}

  @Post("/")
  @Returns(201, User).Groups("group.*")
  async post(@BodyParams() @Groups("creation") user: User) {
    console.log(user); // User {firstName, lastName, email, password}
    user.id = uuid();

    return user; // will return Object {id, firstName, lastName, email}
  }
}
