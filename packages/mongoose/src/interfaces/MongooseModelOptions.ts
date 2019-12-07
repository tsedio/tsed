import {MongooseSchemaOptions} from "./MongooseSchemaOptions";

export interface MongooseModelOptions extends MongooseSchemaOptions {
  name?: string;
  connection?: string;
  collection?: string;
  skipInit?: boolean;
}
