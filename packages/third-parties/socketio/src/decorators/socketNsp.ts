import {SocketFilters} from "../interfaces/SocketFilters.js";
import {Namespace} from "./nsp.js";
import {SocketFilter} from "./socketFilter.js";

export type SocketNsp = Namespace;

/**
 * Inject the [SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#namespaces) instance in the decorated parameter.
 * This namespace may differ from the default namespace when using dynamic namespaces.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService(/nsp-.+/)
 * export class MyWS {
 *
 *   @Input("event")
 *   myMethod(@SocketNsp nsp: SocketNsp) {
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
export function SocketNsp(target: any, propertyKey: string, index: number): any {
  return SocketFilter(SocketFilters.SOCKET_NSP)(target, propertyKey, index);
}
