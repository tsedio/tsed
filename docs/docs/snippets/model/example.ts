import {Default, Enum, Format, Maximum, MaxLength, Minimum, MinLength, Pattern, Required} from "@tsed/schema";

enum Categories {
  CAT1 = "cat1",
  CAT2 = "cat2"
}

export class MyModel {
  _id: string;

  @Required()
  unique: string;

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

  @Pattern(/[a-z]/)
  pattern: String;

  @Format("date-time")
  @Default(Date.now)
  dateCreation: Date = new Date();
}
