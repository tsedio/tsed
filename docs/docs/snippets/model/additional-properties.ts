import {AdditionalProperties, Property} from "@tsed/schema";

@AdditionalProperties(true)
export class Model {
  @Property()
  id: string;

  [key: string]: any;
}
