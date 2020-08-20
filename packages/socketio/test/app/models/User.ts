import {Allow, Email, Ignore, MinLength, Property, Required} from "@tsed/common";

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
  @Required()
  @MinLength(6)
  @Allow(null)
  @Ignore()
  password: string;
}
