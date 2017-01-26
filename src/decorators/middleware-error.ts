import MiddlewareService from "../services/middleware";
import {MiddlewareType} from "../interfaces/Middleware";

export function MiddlewareError(): Function {

    return (target: any): void => {

        MiddlewareService.set(target, MiddlewareType.ERROR);

        return target;
    };
}