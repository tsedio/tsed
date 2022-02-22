import Express from "express";
import {PlatformExpressSettings} from "./PlatformExpressSettings";

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
