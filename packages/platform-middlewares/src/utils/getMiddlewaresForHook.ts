import {isFunction} from "@tsed/core";
import {PlatformMiddlewareLoadingOptions} from "../domain/PlatformMiddlewareSettings";

export function getMiddlewaresForHook(hook: string, settings: TsED.Configuration, defaultHook = "") {
  const {env, middlewares = []} = settings;

  return middlewares
    .map<PlatformMiddlewareLoadingOptions>((middleware) => {
      return isFunction(middleware)
        ? {
            env,
            hook: defaultHook,
            use: middleware
          }
        : {
            env,
            hook: defaultHook,
            ...middleware
          };
    })
    .filter((options) => {
      return options.use && options.env === env && options.hook === hook;
    });
}
