import {InjectorService} from "@tsed/di";
import * as util from "util";

export function callHook(injector: InjectorService, rootModule: any, key: string, elseFn = new Function(), ...args: any[]) {
  if (key in rootModule) {
    const hookDepreciation = (hook: string, newHook: string) =>
      util.deprecate(() => {}, `${hook} hook is deprecated. Use ${newHook} instead`)();

    if (key === "$onMountingMiddlewares") {
      hookDepreciation("$onMountingMiddlewares", "$beforeRoutesInit");
    }
    if (key === "$onInit") {
      hookDepreciation("$onInit", "$beforeInit");
    }

    injector.logger.debug(`\x1B[1mCall hook ${key}\x1B[22m`);

    return rootModule[key](...args);
  }

  return elseFn();
}
