import {InjectorService} from "@tsed/di";
import * as util from "util";

const SKIP_HOOKS = ["$beforeInit", "$afterInit", "$onInit", "$onMountingMiddlewares"];

export async function callHook(injector: InjectorService, rootModule: any, key: string, ...args: any[]) {
  injector.logger.info(`\x1B[1mCall hook ${key}\x1B[22m`);

  if (key in rootModule) {
    const hookDepreciation = (hook: string, newHook?: string) =>
      util.deprecate(() => {}, `${hook} hook is deprecated. ${newHook ? "Use" + newHook + "instead" : "Hook will be removed"}`)();

    if (key === "$onInit") {
      hookDepreciation("$onInit", "$beforeInit");
    }
    if (key === "$onMountingMiddlewares") {
      hookDepreciation("$onMountingMiddlewares", "$beforeRoutesInit");
    }

    // istanbul ignore next
    if (key === "$onServerInitError") {
      hookDepreciation("$onServerInitError");
    }

    await rootModule[key](...args);
  }

  if (!SKIP_HOOKS.includes(key)) {
    await injector.emit(key);
  }
}
