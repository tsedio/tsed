import { InjectorService } from '../../di';

export interface IInterceptorContext {
    target: any;
    method: string;
    args: any[];
    proceed: <T>(err?: Error) => T
}

export interface IInterceptor {
    aroundInvoke: <T>(ctx: IInterceptorContext) => T;
}

export function Interceptor(): Function {
    return (target: any): void => {
        InjectorService.service(target);
        return target;
    };
}
