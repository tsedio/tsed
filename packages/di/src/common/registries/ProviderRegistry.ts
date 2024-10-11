import {ControllerProvider} from "../domain/ControllerProvider.js";
import {ProviderType} from "../domain/ProviderType.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import {GlobalProviders} from "./GlobalProviders.js";

GlobalProviders.createRegistry(ProviderType.CONTROLLER, ControllerProvider);

/**
 * Register a provider configuration.
 * @param {ProviderOpts<any>} provider
 */
export function registerProvider<Type = any>(provider: Partial<ProviderOpts<Type>> & Pick<ProviderOpts<Type>, "provide">) {
  return GlobalProviders.merge(provider.provide, provider);
}
