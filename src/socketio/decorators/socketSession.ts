import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketFilter} from "./socketFilter";

export type SocketSession = Map<string, any>;

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
 *   myMethod(@SocketSession session: Map) {
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
export function SocketSession(target: any, propertyKey: string, index: number): any {
    return SocketFilter(SocketFilters.SESSION)(target, propertyKey, index);
}