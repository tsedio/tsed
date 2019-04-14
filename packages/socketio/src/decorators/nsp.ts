import {Store} from "@tsed/core";
import {Namespace as NamespaceType} from "socket.io";
import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketFilter} from "./socketFilter";

export type Namespace = NamespaceType;
export type Nsp = NamespaceType;

/**
 * Inject the [SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#namespaces) instance in the decorated parameter.
 *
 * ### Example
 *
 * ```typescript
 * import {Nsp, SocketService, Input} from "@tsed/socketio";
 *
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Nsp
 *   nsp: SocketIO.Namespace; // will inject SocketIO.Namespace (not available on constructor)
 *
 *   @Nsp("/my-other-namespace")
 *   nspOther: SocketIO.Namespace; // communication between two namespace
 *
 *   @Input("event")
 *   myMethod(@Nsp namespace: SocketIO.Namespace) {
 *
 *   }
 * }
 * ```
 *
 * @param target
 * @param {string} propertyKey
 * @param {number} index
 * @decorator
 */
export function Nsp(target: any, propertyKey?: string, index?: number): any {
  return Namespace(target, propertyKey, index);
}

/**
 * Inject the [SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#namespaces) instance in the decorated parameter.
 *
 * ### Example
 *
 * ```typescript
 * import {Namespace, SocketService, Input} from "@tsed/socketio";
 *
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Nsp
 *   nsp: Namespace; // will inject SocketIO.Namespace (not available on constructor)
 *
 *   @Nsp("/my-other-namespace")
 *   nspOther: Namespace; // communication between two namespace
 *
 *   @Input("event")
 *   myMethod(@Namespace namespace: Namespace) {
 *
 *   }
 * }
 * ```
 *
 * @param target
 * @param {string} propertyKey
 * @param {number} index
 * @alias {Nsp}
 * @decorator
 */
export function Namespace(target: any, propertyKey?: string, index?: number): any {
  if (typeof target === "string") {
    const nsp = target as string;

    return (target: any, propertyKey: string) => {
      Store.from(target).merge("socketIO", {
        injectNamespaces: [{propertyKey, nsp}]
      });
    };
  }

  if (index === undefined) {
    Store.from(target).merge("socketIO", {
      injectNamespaces: [{propertyKey}]
    });

    return;
  }

  return SocketFilter(SocketFilters.NSP)(target, propertyKey!, index!);
}
