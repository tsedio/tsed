import {Service} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {Connection} from "typeorm";
import {User} from "../entity/User";

@Service()
export class UsersService {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) {
  }

  $afterRoutesInit() {
    this.connection = this.typeORMService.get();
  }

  async create(user: User): Promise<User> {
    await this.connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    return user;
  }

  async find(): Promise<User[]> {
    const users = await this.connection.manager.find(User);
    users.forEach((user) => {
      user.additional = "test";
      user.additional2 = "test2";
    });

    console.log("Loaded users: ", users);

    return users;
  }

}
