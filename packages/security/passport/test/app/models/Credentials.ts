import {Email, Groups, MinLength, Required} from "@tsed/schema";

export class Credentials {
  @Email()
  @Required()
  email: string;

  @Required()
  @MinLength(8)
  @Groups("!creation")
  password: string;
}
