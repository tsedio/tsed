import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketFilter} from "./socketFilter";

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
export function SocketErr(target: any, propertyKey: string, index: number): any {
  return SocketFilter(SocketFilters.ERR)(target, propertyKey, index);
}
