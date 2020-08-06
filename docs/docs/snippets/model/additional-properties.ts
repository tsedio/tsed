import {AdditionalProperties, Property} from "@tsed/common";

@AdditionalProperties(true)
export class Model {
  @Property()
  id: string;

  [key: string]: any;
}
