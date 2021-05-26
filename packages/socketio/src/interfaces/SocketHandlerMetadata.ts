import {SocketParamMetadata} from "./SocketParamMetadata";
import {SocketReturnsTypes} from "./SocketReturnsTypes";

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
