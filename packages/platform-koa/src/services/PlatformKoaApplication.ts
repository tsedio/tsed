import Router from "@koa/router";
import {Configuration, PlatformApplication, PlatformMulterSettings} from "@tsed/common";
import Koa from "koa";
import {getMulter} from "../utils/multer";

declare global {
  namespace TsED {
    export interface Application extends Koa {}
  }
}

// @ts-ignore
Router.prototype.$$match = Router.prototype.match;
Router.prototype.match = function match(...args: any[]) {
  const matched = this.$$match(...args);
  if (matched) {
    if (matched.path.length) {
      matched.route = true;
    }
  }

  return matched;
};

/**
 * @platform
 * @express
 */
export class PlatformKoaApplication extends PlatformApplication<Koa, Router> {
  constructor(@Configuration() configuration: Configuration) {
    super();

    this.raw = configuration.get("koa.app", new Koa());
    this.rawRouter = new Router();
  }

  getMulter(options: PlatformMulterSettings) {
    return getMulter(options);
  }

  callback(): any {
    return this.getApp().callback();
  }
}
