import {Type} from "@tsed/core";
import {Provider} from "../class/Provider";

/**
 * @ignore
 */
export interface RegistrySettings {
  // registry: Registry<Provider<any>, IProvider<any>>;
  injectable?: boolean;
  model?: Type<Provider>;

  /**
   *
   * @param provider
   * @param {Map<string | Function, any>} locals
   * @param deps
   */
  onInvoke?(provider: Provider<any>, locals: Map<string | Function, any>, deps: any[]): void;
}
