import {SocketFilters} from "../interfaces/SocketFilters.js";
import {SocketFilter} from "./socketFilter.js";

/**
 * Inject the disconnection reason into the decorated parameter.
 *
 * This decorator is used in conjunction with the `$onDisconnect` event handler to handle disconnection reasons in SocketIO services.
 * It allows you to access the reason for the disconnection in your method implementation. For details please refer to the [Socket.io documentation](https://socket.io/docs/v4/server-api/#event-disconnect).
 *
 * @example
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *   public async $onDisconnect(
 *     @Reason reason: string = ''
 *   ) {
 *      // your implementation
 *   }
 * }
 * ```
 *
 * @experimental This decorator is experimental and may change or be removed in future versions.
 * @param target
 * @param {string} propertyKey
 * @param {number} index
 * @decorator
 */
export function Reason(target: unknown, propertyKey: string, index: number) {
  return SocketFilter(SocketFilters.REASON)(target, propertyKey, index);
}
