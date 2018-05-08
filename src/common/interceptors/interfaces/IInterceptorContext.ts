export interface IInterceptorContext<T> {
  target: T;
  method: string;
  args: any[];
  proceed: <T>(err?: Error) => T;
}
