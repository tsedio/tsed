import {isFunction} from "@tsed/core";
import {DIConfiguration} from "@tsed/di";
import {PlatformMiddlewareLoadingOptions, PlatformMiddlewareSettings} from "../domain/PlatformMiddlewareSettings";

export function getMiddlewaresForHook(hook: string, settings: DIConfiguration, defaultHook = "") {
  const env = settings.env;
  const middlewares = settings.get<PlatformMiddlewareSettings[]>("middlewares", []);

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
