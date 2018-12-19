import {Registry} from "@tsed/core";
import {Provider} from "../class/Provider";
import {IProvider} from "./IProvider";

export interface RegistrySettings {
  registry: Registry<Provider<any>, IProvider<any>>;
  injectable?: boolean;
  buildable: boolean;

  /**
   *
   * @param target
   * @param {Map<string | Function, any>} locals
   * @param {any[]} designParamTypes
   */
  onInvoke?(target: Provider<any>, locals: Map<string | Function, any>, designParamTypes: any[]): void;
}
