import {Indexed, Model, ObjectID, Unique} from "@tsed/mongoose";
import {Default, Enum, Format, Ignore, Maximum, MaxLength, Minimum, MinLength, Pattern, Required} from "@tsed/schema";

enum Categories {
  CAT1 = "cat1",
  CAT2 = "cat2"
}

@Model()
export class MyModel {
  @Ignore() // exclude _id from mongoose in the generated schema
  _id: string;

  @ObjectID("id") // Or rename _id by id (for response sent to the client)
  _id: string;

  @Unique()
  @Required()
  unique: string;

  @Indexed()
  @MinLength(3)
  @MaxLength(50)
  indexed: string;

  @Minimum(0)
  @Maximum(100)
  @Default(0)
  rate: Number = 0;

  @Enum(Categories)
  // or @Enum("type1", "type2")
  category: Categories;

  @Pattern(/[a-z]/) // equivalent of match field in mongoose
  pattern: String;

  @Format("date-time")
  @Default(Date.now)
  dateCreation: Date = new Date();
}
