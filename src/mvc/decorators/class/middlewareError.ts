/**
 * @module mvc
 */
/** */
import {MiddlewareType} from "../../interfaces";
import {MiddlewareRegistry} from "../../registries/MiddlewareRegistry";
/**
 *
 * @returns {(target:any)=>void}
 * @decorator
 */
export function MiddlewareError(): Function {

    return (target: any): void => {

        MiddlewareRegistry.merge(target, {type: MiddlewareType.ERROR});

        return target;
    };
}