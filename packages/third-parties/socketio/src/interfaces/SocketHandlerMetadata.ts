import {SocketParamMetadata} from "./SocketParamMetadata.js";
import {SocketReturnsTypes} from "./SocketReturnsTypes.js";

/**
 *
 */
export interface SocketHandlerMetadata {
  eventName?: string;
  methodClassName: string;
  useBefore?: any[];
  useAfter?: any[];
  parameters?: {[key: number]: SocketParamMetadata};
  returns?: {
    type: SocketReturnsTypes;
    eventName: string;
  };
}
