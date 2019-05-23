import {Property, Required, PropertyName} from "@tsed/common";
import {Model} from "@tsed/mongoose";

@Model()
export class Calendar {
  @PropertyName("id")
  _id: string;

  @Property()
  @Required()
  name: string;

  @Property()
  owner: string;
}
