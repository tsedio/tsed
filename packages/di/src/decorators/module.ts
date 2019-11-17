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

export function Module({imports, deps, root, scope, ...configuration}: Partial<IModuleOptions> = {}) {
  return applyDecorators(
    Configuration(configuration),
    Injectable({
      type: ProviderType.PROVIDER,
      scope: ProviderScope.SINGLETON,
      imports,
      deps,
      injectable: false,
      root
    })
  );
}
