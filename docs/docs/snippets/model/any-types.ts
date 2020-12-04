import {Any} from "@tsed/schema";

export class Model {
  @Any()
  prop1: any;

  @Any("string", "number", "boolean")
  prop2: string | number | boolean; // mixed type

  @Any(String, null)
  prop3: string | null;
}
