import {$on} from "@tsed/hooks";
import {Env} from "@tsed/core";
import {PlatformMiddlewareLoadingOptions} from "../domain/PlatformMiddlewareSettings.js";
import {constant} from "@tsed/di";

export function alterMiddlewaresForHook(middlewares: PlatformMiddlewareLoadingOptions[], hook: string) {
  const env = constant<Env>("env");

  return middlewares.filter((options) => options.use && (!options.env || options.env === env) && options.hook === hook);
}

/**
 * @deprecated will be remove in the next major version
 */
export const getMiddlewaresForHook = alterMiddlewaresForHook;

$on("$alterMiddlewaresForHook", alterMiddlewaresForHook);
