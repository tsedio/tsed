import {SchemaDefinition} from "mongoose";

export interface MongooseSchema {
  schema: SchemaDefinition;
  virtuals: Map<string, any>;
}
