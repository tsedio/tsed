import {ISocketParamMetadata} from "./ISocketParamMetadata";
import {SocketReturnsTypes} from "./SocketReturnsTypes";

/**
 * @experimental
 */
export interface ISocketHandlerMetadata {
    eventName: string;
    methodClassName: string;
    parameters: { [key: number]: ISocketParamMetadata };
    returns?: {
        type: SocketReturnsTypes;
        eventName: string;
    };
}