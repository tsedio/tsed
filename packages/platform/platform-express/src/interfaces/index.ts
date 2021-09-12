import Express from "express";
import {PlatformExpressSettings} from "./PlatformExpressSettings";

export * from "./PlatformExpressSettings";
export * from "./PlatformExpressStaticsOptions";

declare global {
  namespace TsED {
    export interface Configuration {
      /**
       * Configuration related to Express platform application.
       */
      express: PlatformExpressSettings;
    }

    export interface NextFunction extends Express.NextFunction {}
  }
}
