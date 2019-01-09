import {MongooseSchemaOptions} from "./MongooseSchemaOptions";

export interface MongooseModelOptions extends MongooseSchemaOptions {
  name?: string;
  collection?: string;
  skipInit?: boolean;
}
