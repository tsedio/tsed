import {Description, Example, Format, Required} from "@tsed/schema";

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
