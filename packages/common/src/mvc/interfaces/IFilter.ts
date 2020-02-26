import * as Express from "express";

/**
 * @deprecated Use pipe instead
 */
export interface IFilter {
  transform(expression: string, request: Express.Request, response: Express.Response): any;
}
