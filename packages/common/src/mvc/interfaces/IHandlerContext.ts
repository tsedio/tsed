import * as Express from "express";
import {HandlerMetadata} from "../models/HandlerMetadata";
import {ParamMetadata} from "../models/ParamMetadata";

export interface IHandlerContext {
  request: Express.Request;
  response: Express.Response;
  next: Express.NextFunction;
  handler: HandlerMetadata;
  args: any[];
  err?: any;
}

export interface IParamContext extends IHandlerContext {
  param: ParamMetadata;
  expression?: string;
}
