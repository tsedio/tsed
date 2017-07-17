import {Type} from "../../../core/interfaces";
/**
 * @module common/mvc
 */
/** */
import {IMiddleware} from "../../interfaces";
import {MiddlewareRegistry} from "../../registries/MiddlewareRegistry";

export function OverrideMiddleware(targetMiddleware: Type<any> & IMiddleware): Function {
    return (target: any): void => {
        MiddlewareRegistry.merge(targetMiddleware, {useClass: target});
        return target;
    };
}