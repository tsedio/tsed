import {Store} from "../../../core/class/Store";
import {ProviderScope} from "../../../di/interfaces";

/**
 *
 * @param {"request" | "singleton" | ProviderScope} scope
 * @returns {Function}
 * @constructor
 */
export function Scope(scope: "request" | "singleton" | ProviderScope = ProviderScope.REQUEST) {
    return Store.decorate((store) => {
        store.set("scope", scope);
    });
}