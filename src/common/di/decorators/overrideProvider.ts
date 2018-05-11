import {Type} from "@tsed/core";
import {ProviderRegistry} from "../registries/ProviderRegistry";

/**
 * Override a provider which is already registered in ProviderRegistry.
 * @returns {Function}
 * @decorators
 * @param originalProvider
 */
export function OverrideProvider(originalProvider: Type<any>): Function {
  return (target: Type<any>): void => {
    ProviderRegistry.get(originalProvider)!.useClass = target;
  };
}
