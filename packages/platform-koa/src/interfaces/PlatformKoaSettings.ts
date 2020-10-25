import {RouterOptions} from "@koa/router";

export interface PlatformKoaSettings {
  /**
   * Global configuration for the Express.Router. See express [documentation](http://expressjs.com/en/api.html#express.router).
   */
  router: RouterOptions;
}
