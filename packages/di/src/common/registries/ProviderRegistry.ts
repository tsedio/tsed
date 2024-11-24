import {ControllerProvider} from "../domain/ControllerProvider.js";
import {ProviderType} from "../domain/ProviderType.js";
import {injectable} from "../fn/injectable.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import {GlobalProviders} from "./GlobalProviders.js";

GlobalProviders.createRegistry(ProviderType.CONTROLLER, ControllerProvider);

/**
 * Register a provider configuration.
 * @param {ProviderOpts<any>} opts
 */
export function registerProvider<Type = any>(opts: Partial<ProviderOpts<Type>> & Pick<ProviderOpts<Type>, "provide">) {
  return injectable(opts.provide, opts as unknown as Partial<ProviderOpts>).inspect();
}
