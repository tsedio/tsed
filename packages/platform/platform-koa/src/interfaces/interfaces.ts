import Koa from "koa";

import {PlatformKoaSettings} from "./PlatformKoaSettings.js";

export * from "./PlatformKoaSettings.js";

declare global {
  namespace TsED {
    export interface Configuration {
      /**
       * Configuration related to Koa platform application.
       */
      koa: PlatformKoaSettings;
    }

    export interface NextFunction extends Koa.Next {}
  }
}
