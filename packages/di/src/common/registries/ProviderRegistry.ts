import {ControllerProvider} from "../domain/ControllerProvider.js";
import {ProviderType} from "../domain/ProviderType.js";
import {injectable} from "../fn/injectable.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {GlobalProviders} from "./GlobalProviders.js";

GlobalProviders.createRegistry(ProviderType.CONTROLLER, ControllerProvider);

type Opts<Type = any> = Partial<ProviderOpts<Type>> &
  (
    | {
        token: TokenProvider<Type>;
      }
    | {
        /**
         * @deprecated use token prop instead
         */
        provide: TokenProvider<Type>;
      }
  );

/**
 * Register a provider configuration.
 * @deprecated Since v8. Use injectable() function instead.
 */
export function registerProvider<Type = any>({token, provide, ...opts}: Opts<Type>) {
  return injectable(token || provide, {
    ...opts,
    token: token || provide
  } as unknown as Partial<ProviderOpts>).inspect();
}
