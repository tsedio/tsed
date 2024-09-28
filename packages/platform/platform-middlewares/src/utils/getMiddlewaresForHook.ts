import {DIConfiguration} from "@tsed/di";

import {PlatformMiddlewareLoadingOptions} from "../domain/PlatformMiddlewareSettings.js";

export function getMiddlewaresForHook(hook: string, settings: DIConfiguration, defaultHook = "") {
  const env = settings.env;
  const middlewares = settings.get<PlatformMiddlewareLoadingOptions[]>("middlewares", []);

  return middlewares.filter((options) => options.use && options.env === env && options.hook === hook);
}
