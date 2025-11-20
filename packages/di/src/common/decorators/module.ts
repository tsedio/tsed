import {useDecorators} from "@tsed/core/utils/useDecorators.js";

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
 * Declare a Ts.ED module to organize related providers and configuration.
 *
 * Modules group related functionality together, manage provider dependencies,
 * and configure application settings. They are singleton-scoped by default.
 *
 * ### Usage
 *
 * ```typescript
 * import {Module} from "@tsed/di";
 *
 * @Module({
 *   imports: [DatabaseService, CacheService],
 *   mount: {
 *     "/api": [UserController, ProductController]
 *   }
 * })
 * export class AppModule {
 *   constructor(private db: DatabaseService) {
 *     // Dependencies injected
 *   }
 *
 *   $onInit() {
 *     this.db.connect();
 *   }
 * }
 * ```
 *
 * ### Options
 *
 * - `imports`: Providers to initialize before this module
 * - `deps`: Constructor dependencies (explicit declaration)
 * - `mount`: Route mappings for controllers
 * - `scope`: Provider scope (default: singleton)
 * - Additional properties are stored as module configuration
 *
 * @param options Module configuration options
 * @returns Class decorator function
 * @public
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
