import {Property} from "@tsed/schema";
import {Entity, PrimaryKey} from "@mikro-orm/core";
import {ObjectId} from "@mikro-orm/mongodb";

@Entity()
export class User {
  @PrimaryKey()
  @Property()
  _id: ObjectId;
}
