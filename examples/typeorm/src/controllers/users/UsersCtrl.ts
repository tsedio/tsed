import {BodyParams, Controller, Get, PathParams, Post} from "@tsed/common";
import {Returns} from "@tsed/schema"
import {User} from "../../entities/User";
import {UserCreation} from "../../models/UserCreation";
import {UserRepository} from "../../repositories/UserRepository";

@Controller("/users")
export class UsersCtrl {
  constructor(private userRepository: UserRepository) {
  }

  @Post("/")
  @Returns(200, User)
  create(@BodyParams() user: UserCreation): Promise<User> {
    return this.userRepository.save(user);
  }

  @Get("/:id")
  @Returns(200, User)
  async get(@PathParams('id') id: string): Promise<User> {
    return this.userRepository.findByID(id);
  }

  @Get("/")
  @Returns(200, Array).Of(User)
  async getList(): Promise<User[]> {
    return this.userRepository.find();
  }
}
