import {IgnoreProperty} from "@tsed/common";
import {Description} from "@tsed/swagger";
import {UserCreation} from "./UserCreation";

export class User extends UserCreation {
  @Description("Database assigned id")
  _id: string;

  @IgnoreProperty()
  password: string;

  verifyPassword(password: string) {
    return this.password === password;
  }
}
