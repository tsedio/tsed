import {Property} from "@tsed/common";
import {Schema} from "@tsed/mongoose";

@Schema()
export class MyModel {
  @Property()
  unique: string;
}
