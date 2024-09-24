import {CollectionOf, Description, Minimum, Property} from "@tsed/schema";

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
