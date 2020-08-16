import {Description, Example, Minimum, Required} from "@tsed/common";
import {Column} from "typeorm";
import {Credentials} from "./Credentials";

export class UserCreation extends Credentials {
  @Description("User first name")
  @Column()
  @Required()
  firstName: string;

  @Description("User last name")
  @Column()
  @Required()
  lastName: string;

  @Description("User age")
  @Column()
  @Minimum(18)
  @Example(18)
  age: number;
}
