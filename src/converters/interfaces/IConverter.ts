/**
 * @module common/converters
 */
/** */


export interface IConverter {
    deserialize?(data: any, targetType?: any, baseType?: any): any;
    serialize?(object: any): any;
}