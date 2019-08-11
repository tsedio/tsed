import * as Express from "express";
// import {IParamContext} from "../../mvc/interfaces/IHandlerContext";

export interface IFilter {
  // transform(value: any, context: IParamContext): any;
  transform(expression: string, request: Express.Request, response: Express.Response): any;
}
