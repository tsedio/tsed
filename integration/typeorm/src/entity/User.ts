import {Minimum, Required} from "@tsed/common";
import {Example} from "@tsed/swagger";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Required()
  firstName: string;

  @Column()
  @Required()
  lastName: string;

  @Column()
  @Minimum(18)
  @Example(18)
  age: number;

}