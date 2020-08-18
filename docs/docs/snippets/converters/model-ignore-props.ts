import {Ignore, Property, Required} from "@tsed/schema";

export class UserCreation {
  @Ignore()
  _id: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Required()
  password: string;
}

export class User extends UserCreation {
  @Ignore()
  password: string;
}
