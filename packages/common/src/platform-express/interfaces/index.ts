import * as Express from "express";
import {RequestContext} from "../../platform";
import "./Express";

export * from "./IServerLifeCycle";
export * from "./IHTTPSServerOptions";

declare global {
  namespace TsED {
    export interface NextFunction extends Express.NextFunction {}

    export interface Request extends Express.Request {
      id: string;
      ctx: RequestContext;
    }

    export interface Response extends Express.Response {}
  }
}
