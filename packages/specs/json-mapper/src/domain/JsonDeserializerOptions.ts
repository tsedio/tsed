import {MetadataTypes, Type} from "@tsed/core";
import {JsonEntityStore} from "@tsed/schema";

import {JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";
import {JsonMapperGlobalOptions} from "./JsonMapperGlobalOptions.js";

export interface JsonDeserializerOptions<T = any, C = any> extends MetadataTypes<T, C>, JsonMapperGlobalOptions {
  /**
   * Types used to map complex types (Symbol, Array, Set, Map)
   */
  types?: Map<Type | Symbol | string, JsonMapperMethods>;
  /**
   * useAlias mapping
   */
  useAlias?: boolean;
  /**
   * Use the store which have all metadata to deserialize correctly the model. This
   * property is useful when you deal with metadata parameters.
   */
  store?: JsonEntityStore;
  /**
   *
   */
  groups?: string[] | false;
  /**
   * Add types to deserialize a module using generics feature.
   */
  generics?: Type[][];

  [key: string]: any;
}
