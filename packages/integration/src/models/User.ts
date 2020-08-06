import {Allow, Email, Ignore, MinLength, Property, Required} from "@tsed/common";
import {Hidden} from "@tsed/swagger";
import {Indexed, Model, Unique} from "../../../../packages/mongoose/src/decorators";

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
  @Required()
  @MinLength(6)
  @Allow(null)
  @Ignore()
  password: string;
}
