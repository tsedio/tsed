export interface InterceptorNext {
  <T>(err?: Error): T;
}

/**
 * @deprecated Use InterceptorNext
 */
export interface IInterceptorNextHandler extends InterceptorNext {}

export interface InterceptorContext<T> {
  target: T;
  propertyKey: string;
  args: any[];
  next: InterceptorNext;
  options?: any;
}

/**
 * @deprecated Use InterceptorContext
 */
export interface IInterceptorContext<T> extends InterceptorContext<T> {}
