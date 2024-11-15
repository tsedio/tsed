import {useDecorators} from "@tsed/core";

import {ProviderScope} from "../domain/ProviderScope.js";
import {ProviderType} from "../domain/ProviderType.js";
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
   * Additional properties are stored as provider configuration.
   */
  [key: string]: any;
}

/**
 * Declare a new Ts.ED module
 *
 * ## Options
 * - imports: List of Provider which must be built by injector before invoking the module
 * - deps: List of provider must be injected to the module constructor (explicit declaration)
 *
 * @param options
 * @decorator
 */
export function Module(options: Partial<ModuleOptions> = {}) {
  const {scopes, imports, deps, scope, ...configuration} = options;

  return useDecorators(
    Configuration(configuration),
    Injectable({
      type: ProviderType.MODULE,
      scope: ProviderScope.SINGLETON,
      imports,
      deps,
      injectable: false
    })
  );
}
