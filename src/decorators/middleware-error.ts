import MiddlewareService from "../services/middleware";

export function MiddlewareError(): Function {

    return (target: any): void => {

        MiddlewareService.set(target, 'error');

        return target;
    };
}