import {SocketFilter} from "./socketFilter.js";
import {SocketFilters} from "../interfaces/SocketFilters.js";

/**
 * Inject the error in the parameters
 *
 * ### Example
 *
 * ```typescript
 * @SocketMiddlewareError()
 * export class MyMiddleware {
 *
 *   myMethod(@SocketErr err: any, @Args() arguments: any[]) {
 *
 *   }
 * }
 * ```
 *
 * @decorator
 * @param target
 * @param propertyKey
 * @param index
 */
export function SocketErr(target: Object, propertyKey: string, index: number): any {
  return SocketFilter(SocketFilters.ERR)(target, propertyKey, index);
}
