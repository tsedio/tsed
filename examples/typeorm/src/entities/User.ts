import {Ignore, Description} from "@tsed/schema";
import {Entity, PrimaryGeneratedColumn} from "typeorm";
import {UserCreation} from "../models/UserCreation";

@Entity()
export class User extends UserCreation {
  @Description("Database assigned id")
  @PrimaryGeneratedColumn()
  id: number;

  @Ignore()
  password: string;

  verifyPassword(password: string) {
    return this.password === password;
  }
}
