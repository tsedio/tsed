/**
 * @module mvc
 */
/** */
import {ControllerRegistry} from "../../registries/ControllerRegistry";
import {IRouterOptions} from "../../interfaces/ControllerOptions";
/**
 *
 * @param options
 * @returns {(target:any)=>void}
 * @decorator
 */
export function RouterSettings(routerOptions: IRouterOptions): Function {

    return (target: any): void => {

        ControllerRegistry.merge(target, {routerOptions});

    };
}
/**
 *
 * @param mergeParams
 * @returns {Function}
 * @decorator
 */
export function MergeParams(mergeParams: boolean) {
    return RouterSettings({mergeParams});
}
/**
 *
 * @param caseSensitive
 * @returns {Function}
 * @decorator
 */
export function CaseSensitive(caseSensitive: boolean) {
    return RouterSettings({caseSensitive});
}
/**
 *
 * @param strict
 * @returns {Function}
 * @decorator
 */
export function Strict(strict: boolean) {
    return RouterSettings({strict});
}