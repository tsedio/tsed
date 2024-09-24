import {Controller} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";
import {Get, Post} from "@tsed/schema";

import {User} from "../entities/User";
import {UsersService} from "../services/UsersService";

@Controller("/users")
export class UsersCtrl {
  constructor(private usersService: UsersService) {}

  @Post("/")
  create(@BodyParams() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get("/")
  getList(): Promise<User[]> {
    return this.usersService.find();
  }
}
