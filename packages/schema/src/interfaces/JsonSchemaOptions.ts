import {SpecTypes} from "../domain/SpecTypes";

export interface JsonSchemaOptions {
  useAlias?: boolean;
  schemas?: any;
  root?: any;
  spec?: SpecTypes;

  [key: string]: any;
}
