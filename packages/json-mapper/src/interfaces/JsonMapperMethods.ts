import {Type} from "@tsed/core";

export interface JsonMapperCtx<T = any, C = any> {
  collectionType: Type<C> | undefined;
  type: Type<T> | T;
  next: JsonMapperNext;
}

export interface JsonMapperNext {
  (obj: any): any;
}

export interface JsonMapperMethods {
  /**
   *
   * @param obj
   * @param {JsonMapperNext} ctx
   * @returns {any}
   */
  deserialize<T = any, C = any>(obj: any, ctx: JsonMapperCtx<T, C>): any;

  /**
   *
   * @param obj
   * @param ctx
   * @returns {any}
   */
  serialize(obj: any, ctx: JsonMapperCtx<any>): any;
}
