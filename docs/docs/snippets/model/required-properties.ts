import {Any, Minimum, Required} from "@tsed/common";

export class Model {
  @Required()
  prop1: string;

  @Required(null) // allow null
  @Any(String, null)
  prop2: string | null;

  @Required()
  @Minimum(1) // doesn't allow 0
  prop3: number;
}
