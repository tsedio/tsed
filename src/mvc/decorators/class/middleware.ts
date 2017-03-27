/**
 * @module mvc
 */
/** */
import {MiddlewareType} from "../../interfaces/index";
import {MiddlewareRegistry} from "../../registries/MiddlewareRegistry";
/**
 *
 * @returns {(target:any)=>void}
 * @decorator
 */
export function Middleware(): Function {

    return (target: any): void => {

        MiddlewareRegistry.merge(target, {type: MiddlewareType.MIDDLEWARE});

        return target;
    };
}