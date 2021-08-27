import {Type} from "@tsed/core";
import type {Provider} from "../domain";
import {TokenProvider} from "./TokenProvider";

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
   * @param deps
   */
  onInvoke?(provider: Provider, locals: Map<TokenProvider, any>, deps: any[]): void;
}
