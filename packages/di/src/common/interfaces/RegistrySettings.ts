import {Type} from "@tsed/core";
import type {Provider} from "../domain/Provider.js";
import type {InjectorService} from "../services/InjectorService.js";
import type {ResolvedInvokeOptions} from "./ResolvedInvokeOptions.js";

/**
 * @ignore
 */
export interface RegistrySettings {
  injectable?: boolean;
  model?: Type<Provider>;

  /**
   *
   * @param provider
   * @param {Map<string | Function, any>} locals
   * @param options
   */
  onInvoke?(provider: Provider, locals: Map<string | Function, any>, options: ResolvedInvokeOptions & {injector: InjectorService}): void;
}
