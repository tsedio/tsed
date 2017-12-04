/**
 * @module common/mvc
 */
/** */
import {ControllerRegistry} from "../../registries/ControllerRegistry";
import {IRouterOptions} from "../../../config/interfaces/IRouterOptions";

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

