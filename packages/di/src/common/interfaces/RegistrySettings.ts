import {Type} from "@tsed/core";

import type {LocalsContainer} from "../domain/LocalsContainer.js";
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
   * @param options
   */
  onInvoke?(provider: Provider, options: ResolvedInvokeOptions): void;
}
