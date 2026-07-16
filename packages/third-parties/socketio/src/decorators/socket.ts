import {SocketFilter} from "./socketFilter.js";
import {SocketFilters} from "../interfaces/SocketFilters.js";
import {Socket as SocketType} from "socket.io";

export type Socket = SocketType;

/**
 * Inject the Socket instance in the decorated parameter.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Input("event")
 *   myMethod(@Socket socket) {
 *
 *   }
 * }
 * ```
 *
 * @experimental
 * @param target
 * @param {string} propertyKey
 * @param {number} index
 * @decorator
 */
export function Socket(target: Object, propertyKey: string, index: number): any {
  return SocketFilter(SocketFilters.SOCKET)(target, propertyKey, index);
}
