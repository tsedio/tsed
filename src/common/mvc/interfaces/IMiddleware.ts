/**
 *
 */

export interface IMiddleware {
  use(...args: any[]): void | any | Promise<any>;
}
