import {Minimum, Required, Property} from "@tsed/common";
import {Example, Description} from "@tsed/swagger";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
  @Description('Database assigned id')
  @PrimaryGeneratedColumn()
  id: number;

  @Description('User firstname')
  @Column()
  @Required()
  firstName: string;

  @Description('User lastname')
  @Column()
  @Required()
  lastName: string;

  @Description('User Age')
  @Column()
  @Minimum(18)
  @Example(18)
  age: number;

  additional: string; // won't be serialized/deserialized by Ts.ED because @PropertyType or other Ts.ED decorator are missing

  @Property()
  additional2: string;
}
