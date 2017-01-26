import MiddlewareService from "../services/middleware";
import {MiddlewareType} from "../interfaces/Middleware";

export function Middleware(): Function {

    return (target: any): void => {

        MiddlewareService.set(target, MiddlewareType.MIDDLEWARE);

        return target;
    };
}