import {Format, Required, Description, Example} from "@tsed/common";
import {Column} from "typeorm";

export class Credentials {
  @Description("User password")
  @Example("/5gftuD/")
  @Column()
  @Required()
  password: string;

  @Description("User email")
  @Example("user@domain.com")
  @Format("email")
  @Column({unique: true})
  email: string;
}
