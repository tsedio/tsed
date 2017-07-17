/**
 * @module common/mvc
 */
/** */
import {RouterSettings} from "./routerSettings";
/**
 *
 * @param strict
 * @returns {Function}
 * @decorator
 */
export function Strict(strict: boolean) {
    return RouterSettings({strict});
}