import {AdditionalProperties, getJsonSchema, Property} from "@tsed/common";

class AnotherModel {
  @Property()
  name: string;
}

@AdditionalProperties(getJsonSchema(AnotherModel))
export class Model {
  [key: string]: AnotherModel;
}
