// eslint
import {Inject, Injectable} from "@tsed/di";
import {Model, MongooseModel, MongoosePlugin} from "@tsed/mongoose";
import * as findOrCreate from "mongoose-findorcreate";

import {User} from "./User";

@Model()
@MongoosePlugin(findOrCreate)
class UserModel {
  // this isn't the complete method signature, just an example
  static findOrCreate(condition: InstanceType<User>): Promise<{doc: InstanceType<User>; created: boolean}>;
}

@Injectable()
class UserService {
  constructor(@Inject(UserModel) userModel: MongooseModel<UserModel>) {
    UserModel.findOrCreate({
      // ...
    }).then((findOrCreateResult) => {
      // ...
    });
  }
}
