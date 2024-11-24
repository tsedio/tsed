import {InjectorService} from "../services/InjectorService.js";

let globalInjector: InjectorService = new InjectorService();

/**
 * Return the existing injector service.
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
export function injector(): InjectorService {
  return globalInjector;
}

export async function destroyInjector() {
  await globalInjector.destroy();
  globalInjector = new InjectorService();
}
