import {SocketReturnsTypes} from "../interfaces/SocketReturnsTypes.js";
import {SocketReturns} from "./socketReturns.js";

/**
 * Emit the response to the client.
 *
 * With the `@Emit` decorator, the method will accept a return type (Promise or not).
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Input("event")
 *   @Emit("returnEvent")
 *   async myMethod(@Args(0) data: any, @Nsp socket): Promise<any> {
 *      return Promise.resolve({data})
 *   }
 * }
 * ```
 *
 * @decorator
 * @param eventName
 */
export function Emit(eventName: string) {
  return SocketReturns(eventName, SocketReturnsTypes.EMIT);
}
