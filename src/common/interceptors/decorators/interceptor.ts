import { InjectorService } from "../../di";

export interface IInterceptorContext {
    target: any;
    method: string;
    args: any[];
    proceed: <T = any>(err?: Error) => T;
}

export interface IInterceptor {
    aroundInvoke: (ctx: IInterceptorContext, options?: any) => any;
}

export function Interceptor(): Function {
    return (target: any): void => {
        InjectorService.service(target);
        return target;
    };
}
