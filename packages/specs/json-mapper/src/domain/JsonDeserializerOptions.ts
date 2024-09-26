import type {MetadataTypes, Type} from "@tsed/core";
import type {JsonEntityStore} from "@tsed/schema";

import type {JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";
import type {JsonMapperGlobalOptions} from "./JsonMapperGlobalOptions.js";

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
