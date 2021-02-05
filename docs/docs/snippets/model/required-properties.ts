import {Minimum, Nullable, Required} from "@tsed/schema";

export class Model {
  @Required()
  prop1: string;

  @Required(true, null) // allow null
  @Nullable(String)
  prop2: string | null;

  @Required()
  @Minimum(1) // doesn't allow 0
  prop3: number;
}
