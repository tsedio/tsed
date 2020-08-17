import {Allow, Email, Ignore, MinLength, Property, Required} from "@tsed/schema";
import {Hidden} from "@tsed/swagger";
import {Indexed, Model, ObjectID, Unique} from "@tsed/mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

@Hidden()
export class UserCreation {
  @Property()
  name: string;

  @Indexed()
  @Required()
  @Email()
  @Unique()
  @Allow(null)
  email: string;

  @Required()
  @MinLength(6)
  @Allow(null)
  password: string;
}

@Hidden()
@Model()
export class User extends UserCreation {
  @ObjectID("id")
  _id: ObjectID;

  @Required()
  @MinLength(6)
  @Allow(null)
  @Ignore()
  password: string;
}
