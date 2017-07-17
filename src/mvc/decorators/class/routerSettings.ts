/**
 * @module common/mvc
 */
/** */
import {IRouterOptions} from "../../interfaces";
import {ControllerRegistry} from "../../registries/ControllerRegistry";

/**
 *
 * @returns {(target:any)=>void}
 * @decorator
 * @param routerOptions
 */
export function RouterSettings(routerOptions: IRouterOptions): Function {

    return (target: any): void => {

        ControllerRegistry.merge(target, {routerOptions});

    };
}

