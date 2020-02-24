import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {HandlerMetadata, ParamMetadata} from "../../mvc";

export interface IHandlerContext {
  injector: InjectorService;
  request: Express.Request;
  response: Express.Response;
  next: Express.NextFunction;
  metadata: HandlerMetadata;
  args: any[];
  err?: any;
}

export interface IParamContext extends IHandlerContext {
  param: ParamMetadata;
  expression?: string;
}
