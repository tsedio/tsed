import {BroadcastOthers} from "./broadcastOthers.js";
import {Input} from "./input.js";

/**
 * Attach the decorated method to the socket event and broadcast the response to all clients with the exception of the connected customer.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @InputAndBroadcastOthers("event")
 *   async myMethod(@Args(0) data: any, @Nsp socket) {
 *      return {data: "data"};
 *   }
 * }
 * ```
 *
 * @decorator
 * @param eventName
 */
export function InputAndBroadcastOthers(eventName: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Input(eventName)(target, propertyKey, descriptor);
    BroadcastOthers(eventName)(target, propertyKey, descriptor);
  };
}
