import {Property} from "@tsed/common";
import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Property()
  id: number;
}
