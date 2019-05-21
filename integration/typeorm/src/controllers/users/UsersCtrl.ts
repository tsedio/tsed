import {BodyParams, Controller, Get, Post} from "@tsed/common";
import {ReturnsArray} from "@tsed/swagger";
import {User} from "../../entity/User";
import {UsersService} from "../../services/UsersService";

@Controller("/users")
export class UsersCtrl {

  constructor(private usersService: UsersService) {
  }

  @Post("/")
  create(@BodyParams() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get("/")
  @ReturnsArray(User)
  async getList(): Promise<User[]> {
    return this.usersService.find();
  }
}
