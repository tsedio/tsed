import {Type} from "@tsed/core";

import type {Provider} from "../domain/Provider.js";

/**
 * @ignore
 */
export interface RegistrySettings {
  injectable?: boolean;
  model?: Type<Provider>;
}
