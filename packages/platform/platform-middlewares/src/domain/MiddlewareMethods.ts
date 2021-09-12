export interface MiddlewareMethods {
  use(...args: any[]): void | any | Promise<any>;
}

/**
 * @deprecated Since v6. Use MiddlewareMethods instead
 */
export interface IMiddleware extends MiddlewareMethods {}
