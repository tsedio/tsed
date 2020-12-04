import {AdditionalProperties, Property} from "@tsed/schema";

@AdditionalProperties({type: "string"})
export class Model {
  @Property()
  id: string;

  [key: string]: string;
}
