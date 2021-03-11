import {InjectorService} from "@tsed/di";

const SKIP_HOOKS = ["$beforeInit", "$afterInit", "$onInit", "$onMountingMiddlewares"];

export async function callHook(injector: InjectorService, rootModule: any, key: string, ...args: any[]) {
  if (!injector.settings.logger.disableBootstrapLog) {
    injector.logger.info(`\x1B[1mCall hook ${key}\x1B[22m`);
  }

  if (key in rootModule) {
    await rootModule[key](...args);
  }

  if (!SKIP_HOOKS.includes(key)) {
    await injector.emit(key);
  }
}
