import {MetadataTypes, Type} from "@tsed/core";

import {JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";
import {JsonMapperGlobalOptions} from "./JsonMapperGlobalOptions.js";

export interface JsonSerializerOptions<T = any, C = any> extends MetadataTypes<T, C>, Pick<JsonMapperGlobalOptions, "strictGroups"> {
  /**
   * Types used to map complex types (Symbol, Number, String, etc...)
   */
  types?: Map<Type<any> | Symbol | string, JsonMapperMethods>;
  /**
   * useAlias mapping
   */
  useAlias?: boolean;

  [key: string]: any;
}
