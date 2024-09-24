import {Model, ObjectID} from "@tsed/mongoose";
import {Property} from "@tsed/schema";

@Model({
  connection: "db2"
})
export class MyModel {
  @ObjectID("id")
  _id: string;

  @Property()
  unique: string;
}
