import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketFilter} from "./socketFilter";

/**
 * Inject the list of arguments in the decorated parameter.
 *
 * `@Args` accept an index parameter to pick up directly the item in the arguments list.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Input("event")
 *   myMethod(@Args() arguments: any[]) {
 *
 *   }
 *
 *   @Input("event2")
 *   myMethod2(@Args(0) data: any) {
 *
 *   }
 * }
 * ```
 *
 * @experimental
 * @decorator
 * @param mapIndex
 */
export function Args(mapIndex?: number): any {
    return SocketFilter(SocketFilters.ARGS, mapIndex);
}