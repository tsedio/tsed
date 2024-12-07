// import type {RouterOptions} from "@koa/router";

import type {FastifyInstance} from "fastify";

export interface PlatformFastifySettings {
  app?: FastifyInstance;
  // /**
  //  * Koa router options
  //  */
  // router?: RouterOptions;
  // /**
  //  * Body parser options
  //  * @param opts
  //  */
  // bodyParser?: (opts?: Options) => Middleware | Options;
}
