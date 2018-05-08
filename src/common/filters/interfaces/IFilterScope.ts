import * as Express from "express";

export interface IFilterScope {
  request: Express.Request;
  response: Express.Response;
  next: Express.NextFunction;
  err?: any;
}
