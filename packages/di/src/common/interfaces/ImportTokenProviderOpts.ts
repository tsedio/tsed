import type {AbstractType, Type} from "@tsed/core";

import type {TokenProvider} from "./TokenProvider.js";

/**
 * Options for importing a provider with a predefined instance.
 *
 * @public
 */
export type UseImportTokenProviderOpts = {
  token: TokenProvider;
  use: unknown;
};

/**
 * Options for importing a provider using a class constructor.
 *
 * @public
 */
export type UseClassImportTokenProviderOpts = {
  token: TokenProvider;
  useClass: Type | AbstractType<any>;
};

/**
 * Options for importing a provider using a synchronous factory function.
 *
 * @public
 */
export type UseFactoryImportTokenProviderOpts = {
  token: TokenProvider;
  useFactory: (...args: unknown[]) => unknown;
};

/**
 * Options for importing a provider using an asynchronous factory function.
 *
 * @public
 */
export type UseAsyncFactoryImportTokenProviderOpts = {
  token: TokenProvider;
  useAsyncFactory: (...args: unknown[]) => Promise<unknown>;
};

/**
 * Union type representing all valid import provider configuration options.
 *
 * Specifies how an imported provider should be created when listed in module imports or configuration.
 * Supports multiple creation strategies: predefined instances, class constructors, and factory functions.
 *
 * ### Usage
 *
 * ```typescript
 * import {Configuration} from "@tsed/di";
 *
 * @Configuration({
 *   imports: [
 *     {token: MyService, useClass: MyServiceImpl},
 *     {token: "CONFIG", useFactory: () => loadConfig()},
 *     {token: DatabaseService, useAsyncFactory: async () => await connectDB()}
 *   ]
 * })
 * class Server {}
 * ```
 *
 * @public
 */
export type ImportTokenProviderOpts =
  | UseImportTokenProviderOpts
  | UseClassImportTokenProviderOpts
  | UseFactoryImportTokenProviderOpts
  | UseAsyncFactoryImportTokenProviderOpts;
