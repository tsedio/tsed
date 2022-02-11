import {Groups, Name} from "@tsed/schema";
import {Credentials} from "./Credentials";

export class Account extends Credentials {
  @Name("id")
  @Groups("!creation")
  _id: string;

  verifyPassword(password: string) {
    return this.password === password;
  }
}
