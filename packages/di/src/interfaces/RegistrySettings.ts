import {Registry} from "@tsed/core";
import {Provider} from "../class/Provider";
import {IProvider} from "./IProvider";

export interface RegistrySettings {
  registry: Registry<Provider<any>, IProvider<any>>;
  injectable?: boolean;

  /**
   *
   * @param provider
   * @param {Map<string | Function, any>} locals
   * @param deps
   */
  onInvoke?(provider: Provider<any>, locals: Map<string | Function, any>, deps: any[]): void;
}
