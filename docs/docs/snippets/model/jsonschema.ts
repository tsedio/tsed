import {getJsonSchema, MinLength, Required} from "@tsed/common";

class PersonModel {
  @MinLength(3)
  @Required()
  firstName: string;

  @MinLength(3)
  @Required()
  lastName: string;
}

const schema = getJsonSchema(PersonModel);

console.log(schema);
