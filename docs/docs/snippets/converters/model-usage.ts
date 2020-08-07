import {CollectionOf, Minimum, Property} from "@tsed/common";
import {Description} from "@tsed/swagger";

export class Person {
  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Description("Age in years")
  @Minimum(0)
  age: number;

  @CollectionOf(String)
  skills: string[];
}
