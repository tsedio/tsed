import {Injectable} from "@tsed/common";
import {User} from "../../models/User";
import {MemoryCollection} from "../../utils/MemoryCollection";

@Injectable()
export class UsersService extends MemoryCollection<User> {
  constructor() {
    super(User, require("../../../resources/users.json"));
  }

  findById(id: string): User {
    return this.findOne({_id: id});
  }
}
