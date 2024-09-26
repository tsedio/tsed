import type {SocketParamMetadata} from "./SocketParamMetadata.js";
import type {SocketReturnsTypes} from "./SocketReturnsTypes.js";

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
