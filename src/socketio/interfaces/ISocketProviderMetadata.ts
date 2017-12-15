import {ISocketHandlerMetadata} from "./ISocketHandlerMetadata";

/**
 * @experimental
 */
export interface ISocketProviderMetadata {
    namespace: string;
    injectNamespace: string;
    handlers: {
        [propertyKey: string]: ISocketHandlerMetadata
    };
}