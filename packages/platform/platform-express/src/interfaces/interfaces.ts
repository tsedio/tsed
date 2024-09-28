import {NextFunction as ENext, Request as EReq, Response as ERes} from "express";

import {PlatformExpressSettings} from "./PlatformExpressSettings.js";

declare global {
  namespace TsED {
    export interface Configuration {
      /**
       * Configuration related to Express platform application.
       */
      express: PlatformExpressSettings;
    }

    export interface NextFunction extends ENext {}

    export interface Response extends ERes {}
    export interface Request extends EReq {}
  }
}
