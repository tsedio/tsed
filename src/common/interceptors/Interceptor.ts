import { InjectorService } from "@tsed/common";

export interface IInterceptorContext<T = any> {
  target: T;
  method: string;
  args: any[];
  proceed: <T>(err?: Error) => T;
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
