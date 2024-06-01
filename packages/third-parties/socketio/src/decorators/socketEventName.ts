import {SocketFilters} from "../interfaces/SocketFilters.js";
import {SocketFilter} from "./socketFilter.js";

/**
 * Inject the Socket instance in the decorated parameter.
 *
 * ### Example
 *
 * ```typescript
 * @SocketMiddleware("/nsp")
 * export class MyMiddleware {
 *   use(@SocketEventName eventName: string) {
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
export function SocketEventName(target: any, propertyKey: string, index: number): any {
  return SocketFilter(SocketFilters.EVENT_NAME)(target, propertyKey, index);
}
