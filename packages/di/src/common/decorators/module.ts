import {useDecorators} from "@tsed/core";

import {ProviderScope} from "../domain/ProviderScope.js";
import {ProviderType} from "../domain/ProviderType.js";
import {DIResolver} from "../interfaces/DIResolver.js";
import {TokenProvider} from "../interfaces/TokenProvider.js";
import {Configuration} from "./configuration.js";
import {Injectable} from "./injectable.js";

export interface ModuleOptions extends Omit<TsED.Configuration, "scopes"> {
  /**
   * Provider scope
   */
  scope?: ProviderScope;
  /**
   * Providers must be initialized before building this module
   */
  imports?: TokenProvider[];
  /**
   * Explicit token must be injected in the constructor
   */
  deps?: TokenProvider[];
  /**
   * A list of resolvers to inject provider from external DI.
   */
  resolvers?: DIResolver[];

  /**
   * Additional properties are stored as provider configuration.
   */
  [key: string]: any;
}

/**
 * Declare a new Ts.ED module
 *
 * ## Options
 * - imports: List of Provider which must be built by injector before invoking the module
 * - resolvers: List of external DI must be used to resolve unknown provider
 * - deps: List of provider must be injected to the module constructor (explicit declaration)
 *
 * @param options
 * @decorator
 */
export function Module(options: Partial<ModuleOptions> = {}) {
  const {scopes, imports, resolvers, deps, scope, ...configuration} = options;

  return useDecorators(
    Configuration(configuration),
    Injectable({
      type: ProviderType.MODULE,
      scope: ProviderScope.SINGLETON,
      imports,
      deps,
      injectable: false,
      resolvers
    })
  );
}
