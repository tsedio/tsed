/**
 *
 */
import {Type} from "@tsed/core";

export interface IDeserializer {
  (obj: any, targetType: any, baseType?: any): any;
}

/**
 *
 */
export interface IConverterIgnoreCB {
  (obj: any, targetType?: any, baseType?: any): any;
}

/**
 *
 */
export interface ISerializer {
  (obj: any): any;
}

/**
 *
 */
export interface IConverterOptions {
  type?: Type<any>;
  ignoreCallback?: IConverterIgnoreCB;
  checkRequiredValue?: boolean;
}

/**
 *
 */
export interface IConverter {
  /**
   *
   * @param data
   * @param targetType
   * @param baseType
   * @param {IDeserializer} deserializer
   * @returns {any}
   */
  deserialize?(data: any, targetType: any, baseType?: any, deserializer?: IDeserializer): any;

  /**
   *
   * @param object
   * @param {ISerializer} serializer
   * @returns {any}
   */
  serialize?(object: any, serializer: ISerializer): any;
}
