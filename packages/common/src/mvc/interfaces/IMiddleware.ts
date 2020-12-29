export interface MiddlewareMethods {
  use(...args: any[]): void | any | Promise<any>;
}

export interface IMiddleware extends MiddlewareMethods {}
