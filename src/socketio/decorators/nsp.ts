import {Store} from "../../core";
import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketFilter} from "./socketFilter";

/**
 * Inject the [SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#namespaces) instance in the decorated parameter.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Nsp
 *   nsp: SocketIO.Namespace; // will inject SocketIO.Namespace (not available on constructor)
 *
 *   @Input("event")
 *   myMethod(@Nsp namespace: SocketIO.Namespace) {
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
export function Nsp(target: any, propertyKey: string, index?: number): any {

    if (index === undefined) {
        Store.from(target).merge("socketIO", {
            injectNamespace: propertyKey
        });
        return;
    }

    return SocketFilter(SocketFilters.NSP)(target, propertyKey, index!);
}

