export interface IInterceptorNextHandler {
  <T>(err?: Error): T;
}

export interface IInterceptorContext<T> {
  target: T;
  propertyKey: string;
  args: any[];
  next: IInterceptorNextHandler;
  options?: any;
  /**
   * @deprecated
   */
  method: string;
  /**
   * @deprecated
   */
  proceed<T>(err?: Error): T;
}
