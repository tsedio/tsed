import {AdditionalProperties, Property} from "@tsed/common";

@AdditionalProperties({type: "string"})
export class Model {
  @Property()
  id: string;

  [key: string]: string;
}
