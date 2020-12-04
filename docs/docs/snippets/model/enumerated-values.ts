import {Any, Enum} from "@tsed/schema";

export enum Colors {
  RED = "red",
  AMBER = "amber",
  GREEN = "green"
}

export class Model {
  @Enum("red", "amber", "green")
  prop1: string;

  @Enum(Colors)
  prop2: Colors;

  @Enum("red", "amber", "green", null, 42)
  @Any("string", "number", "null") // in v6 not required
  prop3: string | number | null;
}
