import {Model} from "@tsed/mongoose";
import {CollectionOf} from "@tsed/schema";

@Model()
export class MyModel {
  @CollectionOf(String)
  list: string[];

  @CollectionOf(String)
  map: Map<string, string>; // key must be a string.
}
