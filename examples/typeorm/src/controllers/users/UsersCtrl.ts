import {BodyParams, Controller, Get, PathParams, Post} from "@tsed/common";
import {ReturnsArray} from "@tsed/swagger";
import {User} from "../../entities/User";
import {UserRepository} from "../../repositories/UserRepository";

@Controller("/users")
export class UsersCtrl {
  constructor(private userRepository: UserRepository) {
  }

  @Post("/")
  create(@BodyParams() user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  @Get("/:id")
  async get(@PathParams() id: string): Promise<User> {
    return this.userRepository.findByID(id);
  }

  @Get("/")
  @ReturnsArray(User)
  async getList(): Promise<User[]> {
    return this.userRepository.find();
  }
}
