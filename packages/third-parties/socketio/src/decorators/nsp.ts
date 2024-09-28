import {decoratorTypeOf, DecoratorTypes, isRegExp, Store} from "@tsed/core";
import {Namespace as NamespaceType} from "socket.io";

import {SocketFilters} from "../interfaces/SocketFilters.js";
import {SocketFilter} from "./socketFilter.js";

export type Namespace = NamespaceType;
export type Nsp = NamespaceType;

/**
 * Inject the [SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#namespaces) instance in the decorated parameter.
 * Note that when using dynamic namespaces, when injecting a parameter, you may want to consider using @SocketNsp instead.
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
 *   @Nsp(/regexp/)
 *   nspDynamic: SocketIO.Namespace; // will inject a dynamic namespace (not available on constructor)
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
 * Note that when using dynamic namespaces, when injecting a parameter, you may want to consider using @SocketNsp instead.
 *
 * ### Example
 *
 * ```typescript
 * import {Namespace, SocketService, Input} from "@tsed/socketio";
 *
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Namespace
 *   nsp: SocketIO.Namespace; // will inject SocketIO.Namespace (not available on constructor)
 *
 *   @Namespace("/my-other-namespace")
 *   nspOther: SocketIO.Namespace; // communication between two namespace
 *
 *   @Namespace(/regexp/)
 *   nspDynamic: SocketIO.Namespace; // will inject a dynamic namespace (not available on constructor)
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
  if (typeof target === "string" || isRegExp(target)) {
    const nsp = target as string | RegExp;

    return (target: any, propertyKey: string) => {
      Store.from(target).merge("socketIO", {
        injectNamespaces: [{propertyKey, nsp}]
      });
    };
  }

  if (decoratorTypeOf([target, propertyKey, index]) === DecoratorTypes.PROP) {
    Store.from(target).merge("socketIO", {
      injectNamespaces: [{propertyKey}]
    });

    return;
  }

  return SocketFilter(SocketFilters.NSP)(target, propertyKey!, index!);
}
