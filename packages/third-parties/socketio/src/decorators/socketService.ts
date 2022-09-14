import {StoreMerge, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {SocketProviderTypes} from "../interfaces/SocketProviderTypes";
import {PROVIDER_TYPE_SOCKET_SERVICE} from "../constants/constants";

/**
 * The decorators `@SocketService()` declare a new socket service (and service) can be injected in other service or controller on there `constructor`.
 * All services annotated with `@SocketService()` are constructed one time.
 *
 * > `@SocketService()` use the `reflect-metadata` to collect and inject service on controllers or other services.
 *
 * @param namespace
 * @returns {Function}
 * @decorator
 */
export function SocketService(namespace: string | RegExp = "/") {
  return useDecorators(
    StoreMerge("socketIO", {namespace, type: SocketProviderTypes.SERVICE}),
    Injectable({
      type: PROVIDER_TYPE_SOCKET_SERVICE
    })
  );
}
