/**
 * @module common/server
 */
/** */
export interface IComponentScanned {
    file: string;
    endpoint: string;
    classes: { [key: string]: any };
}