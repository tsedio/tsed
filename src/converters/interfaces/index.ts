/**
 * @module converters
 */ /** */

/**
 *
 */
export interface IConverter {
    deserialize?(data: any, targetType?: any, baseType?: any): any;
    serialize?(object: any): any;
}
/**
 *
 */
export interface IJsonMetadata<T> {
    name?: string;
    propertyKey?: string;
    use?: { new(): T };
    isCollection?: boolean;
    baseType?: any;
}