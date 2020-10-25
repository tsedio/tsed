import {Property} from "@tsed/schema";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Employee")
export class Employee {
  @PrimaryGeneratedColumn()
  @Property()
  id: number;

  @Column({
    name: "empfname",
  })
  @Property()
  fName: string;

  @Column({
    name: "emplname",
  })
  @Property()
  lName: string;

  @Column()
  @Property()
  createdDate: Date;

  @Column()
  @Property()
  lastModifiedDate: Date;
}
