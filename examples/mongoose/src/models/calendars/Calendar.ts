import {Property, Required} from "@tsed/common";
import {Model, ObjectID} from "@tsed/mongoose";

@Model()
export class Calendar {
  @ObjectID("id")
  _id: string;

  @Required()
  name: string;

  @Property()
  owner: string;
}
