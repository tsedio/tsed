import {MongooseSchemaOptions} from "./MongooseSchemaOptions";
import {CompileModelOptions} from "mongoose";

export interface MongooseModelOptions extends MongooseSchemaOptions {
  name?: string;
  connection?: string;
  collection?: string;
  overwriteModels?: boolean;
  /**
   * @deprecated Since 2022-11-30. Use @DiscriminatorValue instead
   */
  discriminatorValue?: string;
}
