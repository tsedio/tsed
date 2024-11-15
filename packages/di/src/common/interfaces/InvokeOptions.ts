import type {LocalsContainer} from "../domain/LocalsContainer.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {TokenProvider} from "./TokenProvider.js";

export interface InvokeOptions {
  /**
   * Define dependencies to build the provider and inject them in the constructor.
   */
  deps: TokenProvider[];
  /**
   * List of imports to be created before the provider. Imports list aren't injected directly in the provider constructor.
   */
  imports: TokenProvider[];
  /**
   * Parent provider.
   */
  parent?: TokenProvider;
  /**
   * If true, the injector will rebuild the instance.
   */
  rebuild?: boolean;
  /**
   * Option given to injectable props or parameter constructor (UseOpts).
   */
  useOpts?: Record<string, unknown>;

  locals?: LocalsContainer;
}
