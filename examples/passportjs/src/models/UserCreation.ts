import {Required, Description} from "@tsed/common";
import {Credentials} from "./Credentials";

export class UserCreation extends Credentials {
  @Description("User first name")
  @Required()
  firstName: string;

  @Description("User last name")
  @Required()
  lastName: string;

  @Description("User phonenumber")
  phone: string;

  @Description("User address")
  address: string;
}
