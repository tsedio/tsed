import {Schema} from "@tsed/mongoose";
import {Property} from "@tsed/schema";

@Schema()
export class MyModel {
  @Property()
  unique: string;
}
