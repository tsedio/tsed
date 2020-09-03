import * as Express from "express";
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

    export interface Request extends Express.Request {}

    export interface Response extends Express.Response {}
  }
}
