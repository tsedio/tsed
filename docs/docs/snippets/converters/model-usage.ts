import {Minimum, Property, PropertyType} from "@tsed/common";
import {Description} from "@tsed/swagger";

export class Person {
  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Description("Age in years")
  @Minimum(0)
  age: number;

  @PropertyType(String)
  skills: string[];
}
