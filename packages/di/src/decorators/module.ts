import {applyDecorators} from "@tsed/core";
import {IDIResolver, ProviderScope, ProviderType, TokenProvider} from "../interfaces";
import {Configuration} from "./configuration";
import {Injectable} from "./injectable";

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
  resolvers?: IDIResolver[];

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

  return applyDecorators(
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
