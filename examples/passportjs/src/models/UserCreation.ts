import {Required} from "@tsed/common";
import {Description} from "@tsed/swagger";
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
