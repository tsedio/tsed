import InjectorService from "../services/injector";

export function Service(): Function {

    return (target: any): void => {

        InjectorService.service(target);

        return target;
    };
}