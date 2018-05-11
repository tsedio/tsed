import {IInterceptorContext} from "./IInterceptorContext";

export interface IInterceptor {
  aroundInvoke: (ctx: IInterceptorContext<any>, options?: any) => any;
}
