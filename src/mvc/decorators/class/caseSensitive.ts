/**
 * @module common/mvc
 */
/** */
import {RouterSettings} from "./routerSettings";
/**
 *
 * @param caseSensitive
 * @returns {Function}
 * @decorator
 */
export function CaseSensitive(caseSensitive: boolean) {
    return RouterSettings({caseSensitive});
}
