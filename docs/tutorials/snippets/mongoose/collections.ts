import {CollectionOf} from "@tsed/schema";
import {Model} from "@tsed/mongoose";

@Model()
export class MyModel {
  @CollectionOf(String)
  list: string[];

  @CollectionOf(String)
  map: Map<string, string>; // key must be a string.
}
