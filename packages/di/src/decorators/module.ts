import {applyDecorators} from "@tsed/core";
import {IDIConfigurationOptions, ProviderScope, ProviderType, TokenProvider} from "../interfaces";
import {Configuration} from "./configuration";
import {Injectable} from "./injectable";

export interface IModuleOptions extends IDIConfigurationOptions {
  /**
   * Define dependencies to build the provider
   */
  imports?: TokenProvider[];
  /**
   *
   */
  scope?: ProviderScope;

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
export function Module(options: Partial<IModuleOptions> = {}) {
  const {imports, resolvers, deps, scope, ...configuration} = options;

  return applyDecorators(
    Configuration(configuration),
    Injectable({
      type: ProviderType.PROVIDER,
      scope: ProviderScope.SINGLETON,
      imports,
      deps,
      injectable: false,
      resolvers
    })
  );
}
