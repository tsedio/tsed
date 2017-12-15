import {Store} from "../../core";
import {Service} from "../../di";

/**
 * The decorators `@SocketService()` declare a new socket service (and service) can be injected in other service or controller on there `constructor`.
 * All services annotated with `@SocketService()` are constructed one time.
 *
 * > `@SocketService()` use the `reflect-metadata` to collect and inject service on controllers or other services.
 *
 * @experimental
 * @param {string} namespace
 * @returns {Function}
 * @decorator
 */
export function SocketService(namespace = "/") {
    return Store.decorate((store: Store) => {
        store.merge("socketIO", {namespace});
        return Service();
    });
}