import {Nullable, Required} from "@tsed/schema";
import {MyModel, MyModel2} from "./MyModel";

export class Model {
  @Required(true, null) // allow null
  @Nullable(String)
  prop2: string | null;

  // can be used with models (JsonSchema and OS3 only)
  @Nullable(MyModel, MyModel2)
  prop3: MyModel | MyModel2 | null;
}
