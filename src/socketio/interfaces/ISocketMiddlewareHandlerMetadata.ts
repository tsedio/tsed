import {ISocketParamMetadata} from "./ISocketParamMetadata";
import {SocketReturnsTypes} from "./SocketReturnsTypes";

/**
 * @experimental
 */
export interface ISocketMiddlewareHandlerMetadata {
  parameters: {[key: number]: ISocketParamMetadata};
  returns?: {
    type: SocketReturnsTypes;
    eventName: string;
  };
}
