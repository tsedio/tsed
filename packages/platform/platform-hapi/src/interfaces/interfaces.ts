import Hapi from "@hapi/hapi";
import {PlatformHapiSettings} from "./PlatformHapiSettings";

export * from "./PlatformHapiSettings";

declare global {
  namespace TsED {
    export interface Configuration {
      /**
       * Configuration related to Koa platform application.
       */
      hapi: PlatformHapiSettings;
    }
  }
}
