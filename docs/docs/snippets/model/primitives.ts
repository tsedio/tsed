import {Default, getJsonSchema, Maximum, Minimum, Property} from "@tsed/schema";

export class Model {
  _id: string; // Won't be displayed on the Json schema

  @Property()
  prop1: string; // Displayed with the right type

  @Minimum(0)
  @Maximum(100)
  @Default(0)
  prop2: number = 0;
}

console.log(getJsonSchema(Model));
