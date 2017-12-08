import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketFilter} from "./socketFilter";

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
export function Socket(target: any, propertyKey: string, index: number): any {
    return SocketFilter(SocketFilters.SOCKET)(target, propertyKey, index);
}