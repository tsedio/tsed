import {Entity, PrimaryKey} from "@mikro-orm/core";
import type {ObjectId} from "@mikro-orm/mongodb";
import {Property} from "@tsed/schema";

@Entity()
export class User {
  @PrimaryKey()
  @Property()
  _id!: ObjectId;

  @Property()
  email!: string;
}
