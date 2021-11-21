import {Type} from "@tsed/core";
import type {Provider} from "../domain";
import type {InjectorService} from "../services/InjectorService";
import type {ResolvedInvokeOptions} from "./ResolvedInvokeOptions";

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
