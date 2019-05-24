import {PropertyType} from "@tsed/common";
import {Model} from "@tsed/mongoose";

@Model()
export class MyModel {
  @PropertyType(String)
  list: string[];

  @PropertyType(String)
  map: Map<string, string>; // key must be a string.
}
