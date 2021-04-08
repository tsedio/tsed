import {SocketParamMetadata} from "./SocketParamMetadata";
import {SocketReturnsTypes} from "./SocketReturnsTypes";

/**
 * @experimental
 */
export interface ISocketMiddlewareHandlerMetadata {
  parameters: {[key: number]: SocketParamMetadata};
  returns?: {
    type: SocketReturnsTypes;
    eventName: string;
  };
}
