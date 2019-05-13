import {Minimum, Property} from "@tsed/common";
import {Description} from "@tsed/swagger";

class Person {

  _id: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Description("Age in years")
  @Minimum(0)
  age: number;
}
