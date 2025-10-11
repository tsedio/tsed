import {AdditionalProperties, Property, s} from "@tsed/schema";

@AdditionalProperties(s.string())
export class Model {
  @Property()
  id: string;

  [key: string]: string;
}
