import type {Provider} from "../domain/Provider.js";
import type {Type} from "@tsed/core/types/Type.js";

/**
 * @ignore
 */
export interface RegistrySettings {
  injectable?: boolean;
  model?: Type<Provider>;
}
