import {ProviderScope} from "../domain/ProviderScope.js";
import {TokenProvider} from "./TokenProvider.js";

export interface InvokeOptions {
  /**
   * Define dependencies to build the provider and inject them in the constructor.
   */
  deps: unknown[];
  /**
   * List of imports to be created before the provider. Imports list aren't injected directly in the provider constructor.
   */
  imports: unknown[];
  /**
   * Parent provider.
   */
  parent?: TokenProvider;
  /**
   * Scope used by the injector to build the provider.
   */
  scope: ProviderScope;
  /**
   * If true, the injector will rebuild the instance.
   */
  rebuild?: boolean;
}
