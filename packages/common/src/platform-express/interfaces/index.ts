import * as Express from "express";
import {PlatformContext} from "../../platform";
import "./Express";
import {PlatformExpressRouterSettings, PlatformExpressSettings} from "./PlatformExpressSettings";

export * from "./IServerLifeCycle";
export * from "./PlatformExpressSettings";

declare global {
  namespace TsED {
    export interface Configuration {
      /**
       * Global configuration for the Express.Router. See express [documentation](http://expressjs.com/en/api.html#express.router).
       * @deprecated use express.router options
       */
      routers: PlatformExpressRouterSettings;
      /**
       * Configuration related to Express platform application.
       */
      express?: PlatformExpressSettings;
    }

    export interface NextFunction extends Express.NextFunction {}

    export interface Request extends Express.Request {
      id: string;
      ctx: PlatformContext;
    }

    export interface Response extends Express.Response {}
  }
}
