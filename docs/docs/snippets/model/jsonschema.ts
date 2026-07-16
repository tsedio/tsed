import {MinLength, Required, s} from "@tsed/schema";

class PersonModel {
  @MinLength(3)
  @Required()
  firstName: string;

  @MinLength(3)
  @Required()
  lastName: string;
}

const schema = s.compile(PersonModel);

console.log(schema);
