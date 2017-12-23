/**
 * @module common/server
 */
/** */
export interface IComponentScanned {
    endpoint?: string;
    classes: { [key: string]: any };

    [key: string]: any;
}