import {IgnoreProperty, Property} from "@tsed/common";

export class User {
  @IgnoreProperty()
  _id: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @IgnoreProperty()
  password: string;
}
