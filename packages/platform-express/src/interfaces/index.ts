import {RequestContext} from "@tsed/common";
import * as Express from "express";
import "./Express";
import {PlatformExpressSettings} from "./PlatformExpressSettings";

export * from "./PlatformExpressSettings";

declare global {
  namespace TsED {
    export interface Configuration {
      /**
       * Configuration related to Express platform application.
       */
      express: PlatformExpressSettings;
    }

    export interface NextFunction extends Express.NextFunction {}

    export interface Request extends Express.Request {
      id: string;
      ctx: RequestContext;
    }

    export interface Response extends Express.Response {}
  }
}
