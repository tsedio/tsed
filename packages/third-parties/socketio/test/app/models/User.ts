import {ObjectID} from "@tsed/mongoose";
import {Allow, Email, Ignore, MinLength, Property, Required} from "@tsed/schema";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export class UserCreation {
  @Property()
  name: string;

  @Required()
  @Email()
  @Allow(null)
  email: string;

  @Required()
  @MinLength(6)
  @Allow(null)
  password: string;
}

export class User extends UserCreation {
  @ObjectID("id")
  _id: ObjectID;

  @Required()
  @MinLength(6)
  @Allow(null)
  @Ignore()
  declare password: string;
}
