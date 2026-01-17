import {Type} from "@tsed/core";

/**
 * Runtime context passed to mapper methods so they can inspect target types, collection wrappers, and format options.
 */
export interface JsonMapperCtx<T = any, C = any> {
  collectionType: Type<C> | undefined;
  type: Type<T> | T;
  next: JsonMapperNext;
  options: {
    format?: string;
  };
}

/**
 * Function used to delegate to the next mapper in the chain (e.g., nested serialization).
 */
export interface JsonMapperNext {
  (obj: any): any;
}

/**
 * Contract implemented by every custom JSON mapper.
 */
export interface JsonMapperMethods {
  /**
   * Transform raw data into the target type or collection item.
   */
  deserialize<T = any, C = any>(obj: any, ctx: JsonMapperCtx<T, C>): any;

  /**
   * Transform a runtime value into its serialized representation.
   */
  serialize(obj: any, ctx: JsonMapperCtx<any>): any;
}
