import KoaRouter from "@koa/router";
import {Configuration, Inject, PlatformApplication, PlatformHandler} from "@tsed/common";
import Koa from "koa";
import {PlatformKoaRouter} from "./PlatformKoaRouter";

declare global {
  namespace TsED {
    export interface Application extends Koa {}
  }
}

/**
 * @platform
 * @express
 */
export class PlatformKoaApplication extends PlatformKoaRouter implements PlatformApplication<Koa, KoaRouter> {
  app: Koa;
  rawApp: Koa;

  constructor(@Inject() platformHandler: PlatformHandler, @Configuration() configuration: Configuration) {
    super(platformHandler, configuration, {});

    this.rawApp = configuration.get("koa.app") || new Koa();
  }

  getApp(): Koa {
    return this.rawApp;
  }

  callback(): any {
    return this.getApp().callback();
  }
}
