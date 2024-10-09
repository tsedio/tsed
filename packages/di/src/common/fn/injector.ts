import {InjectorService} from "../services/InjectorService.js";

let globalInjector: InjectorService | undefined;

type InjectorFnOpts = {rebuild?: boolean; logger?: any; settings?: Partial<TsED.Configuration>};
/**
 * Create or return the existing injector service.
 *
 * Example:
 *
 * ```typescript
 * import {injector, Injectable} from "@tsed/di";
 *
 * @Injectable()
 * class MyService {
 *   injector = injector();
 * }
 * ```
 */
export function injector(opts?: InjectorFnOpts): InjectorService {
  if (!globalInjector || opts?.rebuild) {
    globalInjector = new InjectorService();

    if (opts && opts.logger) {
      globalInjector.logger = opts.logger;
    }

    if (opts?.settings) {
      globalInjector.settings.set(opts.settings);
    }
  }

  return globalInjector;
}

export function hasInjector() {
  return !!globalInjector;
}

export async function destroyInjector() {
  await globalInjector?.destroy();
  globalInjector = undefined;
}
