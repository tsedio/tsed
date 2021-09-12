import {Env, Type} from "@tsed/core";

export type PlatformMiddlewareLoadingOptions = {env?: Env; use: Function | Type<any>; hook?: string};
export type PlatformMiddlewareSettings = Function | Type<any> | PlatformMiddlewareLoadingOptions | any;

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
