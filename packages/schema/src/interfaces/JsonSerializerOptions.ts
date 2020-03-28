import {SpecTypes} from "../domain/SpecTypes";

export interface JsonSerializerOptions {
  useAlias?: boolean;
  schemas?: any;
  root?: any;
  spec?: SpecTypes;

  [key: string]: any;
}
