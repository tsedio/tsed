import {Ignore, Property} from "@tsed/schema";

export class User {
  @Ignore()
  _id: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Ignore()
  password: string;
}
