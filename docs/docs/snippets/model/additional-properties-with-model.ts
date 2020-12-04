import {AdditionalProperties, Property} from "@tsed/schema";

class AnotherModel {
  @Property()
  name: string;
}

@AdditionalProperties(AnotherModel)
export class Model {
  [key: string]: AnotherModel;
}
