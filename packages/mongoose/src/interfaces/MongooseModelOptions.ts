import {MongooseSchemaOptions} from "./MongooseSchemaOptions";

export interface MongooseModelOptions extends MongooseSchemaOptions {
  name?: string;
  dbName?: string;
  collection?: string;
  skipInit?: boolean;
}
