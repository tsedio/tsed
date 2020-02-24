import {Configuration, Inject, Injectable, InjectorService, ProviderScope} from "@tsed/di";
import * as Express from "express";
import {PlatformDriver} from "./PlatformDriver";
import {PlatformHandler} from "./PlatformHandler";

export const PLATFORM_ROUTER_OPTIONS = Symbol.for("PlatformRouterOptions");

@Injectable({
  scope: ProviderScope.INSTANCE
})
export class PlatformRouter extends PlatformDriver<Express.Router> {
  constructor(
    platform: PlatformHandler,
    @Configuration() configuration: Configuration,
    @Inject(PLATFORM_ROUTER_OPTIONS) routerOptions: any
  ) {
    super(platform);

    this.raw = Express.Router(Object.assign({}, configuration.routers, routerOptions));
  }

  /**
   * Create a new instance of PlatformRouter
   * @param injector
   * @param routerOptions
   */
  static create(injector: InjectorService, routerOptions: any) {
    const locals = new Map();
    locals.set(PLATFORM_ROUTER_OPTIONS, routerOptions);

    return injector.invoke<PlatformRouter>(PlatformRouter, locals);
  }
}
