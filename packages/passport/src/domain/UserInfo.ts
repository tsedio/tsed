import {Format, Property} from "@tsed/common";

export class UserInfo {
  @Property()
  @Format("email")
  email: string;

  @Property()
  password: string;
}
