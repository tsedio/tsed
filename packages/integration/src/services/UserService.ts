import {Inject, Scope, Service} from "@tsed/common";
import {MongooseModel} from "../../../../packages/mongoose/src/interfaces";
import {User, UserCreation} from "../models/User";

@Service()
@Scope("request")
export class UserService {
  user: string;

  public constructor(@Inject(User) private userModel: MongooseModel<User>) {}

  create(userData: UserCreation) {
    const user = new this.userModel(userData);
    const error = user.validateSync();

    if (error) {
      throw error;
    }

    return user;
  }
}
