import {Property} from "@tsed/schema";

export class User {
  _id: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  password: string;
}
