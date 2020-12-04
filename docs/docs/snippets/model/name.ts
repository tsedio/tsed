import {Description, Example, Name} from "@tsed/schema";
import {ObjectID} from "@tsed/mongoose";

export class Model {
  @Name("id")
  @Description("Object ID")
  @Example("5ce7ad3028890bd71749d477")
  _id: string;
}

// same example with mongoose
export class Model2 {
  @ObjectID("id")
  _id: string;
}
