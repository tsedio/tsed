import {Injectable, InjectorService, ProviderScope} from "@tsed/di";
import {createFakeRawDriver} from "./FakeRawDriver";
import {PlatformDriver} from "./PlatformDriver";
import {PlatformHandler} from "./PlatformHandler";

export const PLATFORM_ROUTER_OPTIONS = Symbol.for("PlatformRouterOptions");

declare global {
  namespace TsED {
    export interface Router {}
  }
}
/**
 * Platform Router abstraction layer.
 * @platform
 */
@Injectable({
  scope: ProviderScope.INSTANCE
})
export class PlatformRouter extends PlatformDriver<TsED.Router> {
  constructor(platform: PlatformHandler) {
    super(platform);

    this.raw = PlatformRouter.createRawRouter();
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

  protected static createRawRouter(): any {
    return createFakeRawDriver();
  }
}
