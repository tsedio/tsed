import {Nullable, Required} from "@tsed/schema";

export class Model {
  @Required(true, null) // allow null
  @Nullable(String)
  prop2: string | null;
}
