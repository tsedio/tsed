import {MongooseSchemaOptions} from "./MongooseSchemaOptions";
import {CompileModelOptions} from "mongoose";

export interface MongooseModelOptions extends MongooseSchemaOptions {
  name?: string;
  connection?: string;
  collection?: string;
  overwriteModels?: boolean;
  discriminatorValue?: string;
}
