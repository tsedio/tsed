import {MongooseSchemaOptions} from "./MongooseSchemaOptions.js";

export interface MongooseModelOptions extends MongooseSchemaOptions {
  name?: string;
  connection?: string;
  collection?: string;
  overwriteModels?: boolean;
}
