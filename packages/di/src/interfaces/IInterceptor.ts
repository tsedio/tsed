import {IInterceptorContext, IInterceptorNextHandler} from "./IInterceptorContext";

export interface IInterceptor {
  /**
   * @deprecated Use intercept instead.
   */
  aroundInvoke?(context: IInterceptorContext<any>, options?: any): any;

  intercept?(context: IInterceptorContext<any>, next?: IInterceptorNextHandler): any;
}
