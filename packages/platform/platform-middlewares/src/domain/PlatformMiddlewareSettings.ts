import type {Env, Type} from "@tsed/core";

export type PlatformMiddlewareLoadingOptions = {env?: Env; use: Function | Type<any> | string; hook?: string; options?: any};
export type PlatformMiddlewareSettings = Function | Type<any> | PlatformMiddlewareLoadingOptions | string | any;

declare global {
  namespace TsED {
    interface Configuration {
      /**
       * Load middlewares on the $beforeRoutesInit hook (or on the specified hook event name).
       */
      middlewares: PlatformMiddlewareSettings[];
    }
  }
}
