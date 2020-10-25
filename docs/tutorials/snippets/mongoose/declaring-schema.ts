import {Property} from "@tsed/schema";
import {Schema} from "@tsed/mongoose";

@Schema()
export class MyModel {
  @Property()
  unique: string;
}
