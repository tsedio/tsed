import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketFilter} from "./socketFilter";

export type SocketSession = Map<string, any>;

/**
 * Inject the socket session data in the decorated parameter.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Input("event")
 *   myMethod(@SocketSession session: SocketSession) {
 *     console.log(session);
 *   }
 * }
 * ```
 *
 * @param target
 * @param {string} propertyKey
 * @param {number} index
 * @decorator
 */
export function SocketSession(target: any, propertyKey: string, index: number) {
  return SocketFilter(SocketFilters.SESSION)(target, propertyKey, index);
}

/**
 * Inject the raw `socket.data` in the decorated parameter.
 *
 * @example
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Input("event")
 *   myMethod(@RawSocketSession session: Record<string, unknown>) {
 *     console.log(session);
 *   }
 * }
 * ```
 *
 * @param target
 * @param {string} propertyKey
 * @param {number} index
 * @constructor
 */
export function RawSocketSession(target: any, propertyKey: string, index: number) {
  return SocketFilter(SocketFilters.RAW_SESSION)(target, propertyKey, index);
}
