import {getJsonSchema, MinLength, Required} from "@tsed/schema";

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
