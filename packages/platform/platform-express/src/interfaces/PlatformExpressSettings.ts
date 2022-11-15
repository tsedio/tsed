import type {RouterOptions} from "express";
import type {OptionsJson, OptionsText, Options, OptionsUrlencoded} from "body-parser";
import type {NextHandleFunction} from "connect";

export interface PlatformExpressSettings {
  /**
   * Global configuration for the Express.Router. See express [documentation](http://expressjs.com/en/api.html#express.router).
   */
  router?: RouterOptions;
  /**
   * Express application
   */
  app?: Express.Application;

  /**
   * body parser configuration
   */
  bodyParser?: {
    json?: ((opts?: OptionsJson) => NextHandleFunction) | OptionsJson;
    text?: ((opts?: OptionsText) => NextHandleFunction) | OptionsText;
    raw?: ((opts?: Options) => NextHandleFunction) | Options;
    urlencoded?: ((opts?: OptionsUrlencoded) => NextHandleFunction) | OptionsUrlencoded;
  };

  useRawBody?: boolean;
}
