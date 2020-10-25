export interface InterceptorNext {
  <T>(err?: Error): T;
}

export interface InterceptorContext<T> {
  target: T;
  propertyKey: string;
  args: any[];
  next: InterceptorNext;
  options?: any;
}
