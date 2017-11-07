import {Type} from "../../../core/interfaces";
import {IMiddleware} from "../../interfaces";
import {MiddlewareRegistry} from "../../registries/MiddlewareRegistry";
/**
 * Override a middleware which is already registered in MiddlewareRegistry.
 * @param {Type<any> & IMiddleware} targetMiddleware
 * @returns {Function}
 * @decorators
 */
export function OverrideMiddleware(targetMiddleware: Type<any> & IMiddleware): Function {
    return (target: any): void => {
        MiddlewareRegistry.merge(targetMiddleware, {useClass: target});
        return target;
    };
}