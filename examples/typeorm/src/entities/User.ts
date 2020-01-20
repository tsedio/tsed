import {IgnoreProperty} from "@tsed/common";
import {Description} from "@tsed/swagger";
import {Entity, PrimaryGeneratedColumn} from "typeorm";
import {UserCreation} from "../models/UserCreation";

@Entity()
export class User extends UserCreation {
  @Description("Database assigned id")
  @PrimaryGeneratedColumn()
  id: number;

  @IgnoreProperty()
  password: string;
}
