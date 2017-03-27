import MiddlewareService from "../../services/middleware";
import {MiddlewareType} from "../../enums/MiddlewareType";

export function Middleware(): Function {

    return (target: any): void => {

        MiddlewareService.set(target, MiddlewareType.MIDDLEWARE);

        return target;
    };
}