import {Any, CollectionOf, Enum} from "@tsed/schema";

export enum Colors {
  RED = "red",
  AMBER = "amber",
  GREEN = "green"
}

export enum Days {
  MONDAY = 0,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY
}

export class Model {
  @Enum("red", "amber", "green")
  prop1: string;

  @Enum(Colors)
  prop2: Colors;

  @Enum(Days)
  @CollectionOf(Number)
  prop3: Days[];

  @Enum("red", "amber", "green", null, 42)
  @Any("string", "number", "null") // in v6 not required
  prop4: string | number | null;
}
