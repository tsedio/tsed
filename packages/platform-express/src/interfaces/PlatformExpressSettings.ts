import {RouterOptions} from "express";

export interface PlatformExpressSettings {
  /**
   * Global configuration for the Express.Router. See express [documentation](http://expressjs.com/en/api.html#express.router).
   */
  router?: RouterOptions;

  app?: Express.Application;
}
