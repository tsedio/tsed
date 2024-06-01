import {SocketReturnsTypes} from "../interfaces/SocketReturnsTypes.js";
import {SocketReturns} from "./socketReturns.js";

/**
 * Broadcast the response for all client registered in the same namespace.
 *
 * With the `@Broadcast` decorator, the method will accept a return type (Promise or not).
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Input("event")
 *   @Broadcast("returnEvent")
 *   async myMethod(@Args(0) data: any, @Nsp socket): Promise<any> {
 *      return Promise.resolve({data})
 *   }
 * }
 * ```
 *
 * @decorator
 * @param eventName
 */
export function Broadcast(eventName: string) {
  return SocketReturns(eventName, SocketReturnsTypes.BROADCAST);
}
