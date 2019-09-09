import {applyDecorators} from "@tsed/core";
import {Injectable, ProviderType} from "@tsed/di";
import {IDIConfigurationOptions} from "../interfaces/IDIConfigurationOptions";
import {ProviderScope} from "../interfaces/ProviderScope";
import {TokenProvider} from "../interfaces/TokenProvider";
import {Configuration} from "./configuration";

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
