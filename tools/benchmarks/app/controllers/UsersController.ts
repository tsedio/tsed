import {Controller} from "@tsed/di";
import {PathParams, QueryParams} from "@tsed/platform-params";
import {Default, Get, Integer, Min, Returns} from "@tsed/schema";

import {User} from "../models/User.js";

@Controller("/users")
export class UsersController {
  @Get("/:id")
  @Returns(200, User)
  get(@PathParams("id") @Integer() @Min(1) id: number, @QueryParams("page") @Integer() @Min(1) @Default(1) page: number): User {
    const user = new User();
    user.id = id;
    user.page = page;
    user.name = `user-${id}`;

    return user;
  }
}
