import {AfterRoutesInit} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {TypeORMService} from "@tsed/typeorm";
import {Connection} from "typeorm";

import {User} from "../models/User";

@Injectable()
export class UsersService implements AfterRoutesInit {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) {}

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("mongoose")!; // get connection by name
  }

  async create(user: User): Promise<User> {
    // do something
    // ...
    // Then save
    await this.connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    return user;
  }

  async find(): Promise<User[]> {
    const users = await this.connection.manager.find(User);
    console.log("Loaded users: ", users);

    return users;
  }
}
