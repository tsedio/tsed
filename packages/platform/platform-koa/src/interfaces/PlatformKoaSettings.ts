import type {Middleware} from "koa";
import type {Options} from "koa-bodyparser";
import type {RouterOptions} from "@koa/router";

export interface PlatformKoaSettings {
  /**
   * Koa router options
   */
  router?: RouterOptions;
  /**
   * Body parser options
   * @param opts
   */
  bodyParser?: ((opts?: Options) => Middleware) | Options;
}
