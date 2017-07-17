/**
 * @module common/mvc
 */
/** */

import {RouterSettings} from "./routerSettings";
/**
 *
 * @param mergeParams
 * @returns {Function}
 * @decorator
 */
export function MergeParams(mergeParams: boolean = true) {
    return RouterSettings({mergeParams});
}