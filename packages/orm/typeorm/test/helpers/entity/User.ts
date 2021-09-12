import {Property} from "@tsed/schema";
import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Property()
  id: number;
}
