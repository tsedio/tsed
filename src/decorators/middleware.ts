import MiddlewareService from "../services/middleware";

export function Service(): Function {

    return (target: any): void => {

        MiddlewareService.set(target);

        return target;
    };
}