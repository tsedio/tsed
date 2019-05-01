export interface IInterceptorContext<T> {
  target: T;
  /**
   * @deprecated
   */
  method: string;
  propertyKey: string;
  args: any[];
  proceed: <T>(err?: Error) => T;
}
