import {Broadcast} from "./broadcast";
import {Input} from "./input";

/**
 * Attach the decorated method to the socket event and broadcast the response to all clients.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @InputAndBroadcast("event")
 *   async myMethod(@Args(0) data: any, @Nsp socket) {
 *      return {data: "data"};
 *   }
 * }
 * ```
 *
 * @experimental
 * @decorator
 * @param eventName
 */
export function InputAndBroadcast(eventName: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        Input(eventName)(target, propertyKey, descriptor);
        Broadcast(eventName)(target, propertyKey, descriptor);
    };
}