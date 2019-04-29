import {Service} from "@tsed/common";
import {IUser} from "../../interfaces/User";
import {MemoryStorage} from "../storage/MemoryStorage";

@Service()
export class UsersService {
  constructor(private memoryStorage: MemoryStorage) {
    this.memoryStorage.set("users", require("../../../resources/users.json"));
  }

  async find(id: string) {
    const users: IUser[] = await this.query();
    return users.find((value: IUser) => value._id === id);
  }

  async findByEmail(email: string) {
    const users: IUser[] = await this.query();
    return users.find((value: IUser) => value.email === email);
  }

  async findByCredential(email: string, password: string) {
    const users: IUser[] = await this.query();
    return users.find((value: IUser) => value.email === email && value.password === password);
  }

  async create(user: IUser) {
    user._id = require("node-uuid").v4();
    const users = this.memoryStorage.get<IUser[]>("users");

    users.push(user);

    this.memoryStorage.set("users", users);

    return user;
  }

  async query(): Promise<IUser[]> {
    return this.memoryStorage.get<IUser[]>("users");
  }

  async update(user: IUser): Promise<IUser> {

    const users = await this.query();

    const index = users.findIndex((value: IUser) => value._id === user._id);

    users[index] = user;

    this.memoryStorage.set("users", users);

    return user;
  }
}
