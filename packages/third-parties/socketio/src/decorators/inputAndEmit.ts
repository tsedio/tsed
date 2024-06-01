import {Emit} from "./emit.js";
import {Input} from "./input.js";

/**
 * Attach the decorated method to the socket event and emit the response to the client.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @InputAndEmit("event")
 *   async myMethod(@Args(0) data: any, @Nsp socket) {
 *      return {data: "data"};
 *   }
 * }
 * ```
 *
 * @decorator
 * @param eventName
 */
export function InputAndEmit(eventName: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Input(eventName)(target, propertyKey, descriptor);
    Emit(eventName)(target, propertyKey, descriptor);
  };
}
