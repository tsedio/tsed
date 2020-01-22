import {Format, Required} from "@tsed/common";
import {Description, Example} from "@tsed/swagger";

export class Credentials {
  @Description("User password")
  @Example("/5gftuD/")
  @Required()
  password: string;

  @Description("User email")
  @Example("user@domain.com")
  @Format("email")
  @Required()
  email: string;
}
