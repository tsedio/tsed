import type {LocalsContainer} from "../domain/LocalsContainer.js";
import type {Provider} from "../domain/Provider.js";
import type {TokenProvider} from "./TokenProvider.js";

/**
 * Resolved invocation options used internally by the injector.
 *
 * Contains fully resolved dependencies, provider metadata, and construction logic
 * prepared by the injector before instantiating a provider.
 *
 * @internal
 * @public
 */
export interface ResolvedInvokeOptions {
  token: TokenProvider;
  parent?: TokenProvider;
  deps: TokenProvider[];
  imports: (TokenProvider | [TokenProvider])[];
  provider: Provider;
  locals: LocalsContainer;

  construct(deps: TokenProvider[]): any;
}
